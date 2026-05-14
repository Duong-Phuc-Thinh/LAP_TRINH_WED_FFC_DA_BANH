require('dotenv').config();

const sequelize = require('../config/database');
const {
  Role,
  User,
  Tournament,
  Group,
  Team,
  Player,
  Stadium,
  Match,
  MatchEvent,
  Standing,
  News,
  Notification
} = require('../models');
const { hashPassword } = require('../utils/password');
const { ROLES } = require('../config/roles');
const standingService = require('../services/standingService');

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  const roleRows = [
    [ROLES.USER, 'Normal user can view public AFF Cup data'],
    [ROLES.ORGANIZER, 'Organizer manages tournament, match and stadium data'],
    [ROLES.REFEREE, 'Referee updates match score and match events'],
    [ROLES.ADMIN, 'Admin manages the whole system']
  ];

  for (const [name, description] of roleRows) {
    await Role.findOrCreate({ where: { name }, defaults: { description } });
  }

  const admin = await upsertUser('Admin System', 'admin@aff.local', 'admin123', [ROLES.ADMIN]);
  const organizer = await upsertUser('Organizer Demo', 'organizer@aff.local', '123456', [ROLES.ORGANIZER]);
  const referee = await upsertUser('Referee Demo', 'referee@aff.local', '123456', [ROLES.REFEREE]);
  const user = await upsertUser('User Demo', 'user@aff.local', '123456', [ROLES.USER]);

  const tournament = await upsert(Tournament, {
    where: { name: 'AFF Cup', season: '2026' },
    data: {
      hostCountry: 'ASEAN',
      startDate: '2026-12-01',
      endDate: '2026-12-30',
      status: 'ONGOING',
      format: 'GROUP_KNOCKOUT'
    }
  });

  const groupA = await upsert(Group, {
    where: { tournamentId: tournament.id, name: 'Group A' },
    data: { orderNo: 1 }
  });

  const groupB = await upsert(Group, {
    where: { tournamentId: tournament.id, name: 'Group B' },
    data: { orderNo: 2 }
  });

  const stadiums = await seedStadiums();
  const teams = await seedTeams(tournament, { groupA, groupB });
  const players = await seedPlayers(teams);
  const matches = await seedMatches(tournament, { groupA, groupB }, teams, stadiums, referee);

  await seedMatchEvents(matches, players);
  await standingService.recalculateGroup(tournament.id, groupA.id);
  await standingService.recalculateGroup(tournament.id, groupB.id);
  await seedNews(admin);
  await seedNotifications({ admin, organizer, referee, user });

  const counts = await countSeedData();

  console.log('Seed completed');
  console.log('Admin:', admin.email, 'password: admin123');
  console.log('Organizer:', organizer.email, 'password: 123456');
  console.log('Referee:', referee.email, 'password: 123456');
  console.log('User:', user.email, 'password: 123456');
  console.table(counts);
  await sequelize.close();
}

async function upsertUser(fullName, email, password, roleNames) {
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      fullName,
      passwordHash: await hashPassword(password),
      status: 'ACTIVE'
    }
  });

  if (!created) {
    await user.update({ fullName });
  }

  const roles = await Role.findAll({ where: { name: roleNames } });
  await user.setRoles(roles);
  return user;
}

async function upsert(Model, { where, data }) {
  const [row, created] = await Model.findOrCreate({ where, defaults: data });

  if (!created) {
    await row.update(data);
  }

  return row;
}

async function seedStadiums() {
  const rows = [
    {
      key: 'myDinh',
      name: 'My Dinh National Stadium',
      city: 'Ha Noi',
      country: 'Vietnam',
      capacity: 40000,
      address: 'Nam Tu Liem'
    },
    {
      key: 'raj',
      name: 'Rajamangala National Stadium',
      city: 'Bangkok',
      country: 'Thailand',
      capacity: 51552,
      address: 'Hua Mak'
    },
    {
      key: 'bukit',
      name: 'Bukit Jalil National Stadium',
      city: 'Kuala Lumpur',
      country: 'Malaysia',
      capacity: 87411,
      address: 'Bukit Jalil'
    },
    {
      key: 'gbk',
      name: 'Gelora Bung Karno Stadium',
      city: 'Jakarta',
      country: 'Indonesia',
      capacity: 77193,
      address: 'Senayan'
    }
  ];

  const stadiums = {};

  for (const row of rows) {
    const { key, ...data } = row;
    stadiums[key] = await upsert(Stadium, {
      where: { name: data.name },
      data
    });
  }

  return stadiums;
}

async function seedTeams(tournament, groups) {
  const rows = [
    ['vietnam', 'Vietnam', 'VIE', 'VN', 'Vietnam Head Coach', groups.groupA.id],
    ['thailand', 'Thailand', 'THA', 'TH', 'Thailand Head Coach', groups.groupA.id],
    ['singapore', 'Singapore', 'SGP', 'SG', 'Singapore Head Coach', groups.groupA.id],
    ['laos', 'Laos', 'LAO', 'LA', 'Laos Head Coach', groups.groupA.id],
    ['malaysia', 'Malaysia', 'MAS', 'MY', 'Malaysia Head Coach', groups.groupB.id],
    ['indonesia', 'Indonesia', 'IDN', 'ID', 'Indonesia Head Coach', groups.groupB.id],
    ['philippines', 'Philippines', 'PHI', 'PH', 'Philippines Head Coach', groups.groupB.id],
    ['cambodia', 'Cambodia', 'CAM', 'KH', 'Cambodia Head Coach', groups.groupB.id]
  ];

  const teams = {};

  for (const [key, name, shortName, countryCode, coachName, groupId] of rows) {
    teams[key] = await upsert(Team, {
      where: { tournamentId: tournament.id, shortName },
      data: {
        tournamentId: tournament.id,
        groupId,
        name,
        shortName,
        countryCode,
        coachName,
        logoUrl: `https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`
      }
    });
  }

  return teams;
}

async function seedPlayers(teams) {
  const rowsByTeam = {
    vietnam: [
      [1, 'Nguyen Van An', 'GK', '1998-01-12'],
      [4, 'Tran Duc Anh', 'DF', '1997-03-18'],
      [6, 'Le Minh Khoa', 'MF', '1999-05-21'],
      [8, 'Pham Quang Huy', 'MF', '2000-07-09'],
      [10, 'Do Thanh Dat', 'FW', '1996-09-14'],
      [11, 'Nguyen Tien Long', 'FW', '2001-11-23']
    ],
    thailand: [
      [1, 'Somchai Prasert', 'GK', '1997-02-04'],
      [3, 'Kritsada Wong', 'DF', '1998-06-12'],
      [5, 'Nattapong Chai', 'DF', '1995-08-20'],
      [8, 'Saran Phan', 'MF', '2000-10-02'],
      [10, 'Teerawat Boon', 'FW', '1996-12-15'],
      [11, 'Anan Suriya', 'FW', '2001-04-11']
    ],
    singapore: [
      [1, 'Hafiz Rahman', 'GK', '1998-01-08'],
      [2, 'Daniel Tan', 'DF', '1997-04-19'],
      [5, 'Irfan Lim', 'DF', '1999-07-27'],
      [7, 'Adam Malik', 'MF', '1996-09-02'],
      [9, 'Farhan Lee', 'FW', '2000-05-05'],
      [10, 'Ryan Koh', 'MF', '2001-03-30']
    ],
    laos: [
      [1, 'Khamla Phomma', 'GK', '1997-02-22'],
      [4, 'Sengmany Vong', 'DF', '1998-06-16'],
      [6, 'Anousone Keo', 'MF', '1999-08-11'],
      [8, 'Bounmy Souvann', 'MF', '1996-12-04'],
      [10, 'Phoutthasay Chan', 'FW', '2000-01-19'],
      [11, 'Somphone Inthavong', 'FW', '2001-10-08']
    ],
    malaysia: [
      [1, 'Azlan Hakim', 'GK', '1998-03-11'],
      [3, 'Farid Ismail', 'DF', '1997-05-26'],
      [6, 'Haziq Rahim', 'MF', '1999-07-13'],
      [8, 'Syafiq Adnan', 'MF', '1996-11-07'],
      [9, 'Amir Faiz', 'FW', '2000-02-18'],
      [10, 'Danish Zulkifli', 'FW', '2001-09-25']
    ],
    indonesia: [
      [1, 'Rizky Pratama', 'GK', '1998-04-17'],
      [4, 'Bima Saputra', 'DF', '1997-06-23'],
      [5, 'Agus Santoso', 'DF', '1999-08-29'],
      [7, 'Dimas Wijaya', 'MF', '1996-10-31'],
      [9, 'Fajar Nugraha', 'FW', '2000-12-06'],
      [11, 'Arif Maulana', 'FW', '2001-03-15']
    ],
    philippines: [
      [1, 'Miguel Santos', 'GK', '1998-02-14'],
      [2, 'Paolo Reyes', 'DF', '1997-04-08'],
      [5, 'Marco Cruz', 'DF', '1999-06-20'],
      [8, 'Luis Garcia', 'MF', '1996-08-12'],
      [10, 'Jose Mendoza', 'FW', '2000-10-10'],
      [11, 'Carlos Aquino', 'FW', '2001-12-28']
    ],
    cambodia: [
      [1, 'Dara Sok', 'GK', '1998-01-24'],
      [3, 'Vicheka Kim', 'DF', '1997-03-09'],
      [6, 'Sovann Rith', 'MF', '1999-05-16'],
      [8, 'Chantha Mao', 'MF', '1996-07-21'],
      [9, 'Piseth Long', 'FW', '2000-09-17'],
      [10, 'Sopheak Hem', 'FW', '2001-11-02']
    ]
  };

  const players = {};

  for (const [teamKey, rows] of Object.entries(rowsByTeam)) {
    const team = teams[teamKey];
    players[teamKey] = [];

    for (const [shirtNumber, fullName, position, birthDate] of rows) {
      const player = await upsert(Player, {
        where: { teamId: team.id, shirtNumber },
        data: {
          teamId: team.id,
          fullName,
          shirtNumber,
          position,
          birthDate,
          nationality: team.name
        }
      });

      players[teamKey].push(player);
    }
  }

  return players;
}

async function seedMatches(tournament, groups, teams, stadiums, referee) {
  const rows = [
    ['vie-lao', teams.vietnam, teams.laos, groups.groupA, stadiums.myDinh, '2026-12-01 19:30:00', 'FINISHED', 2, 0],
    ['tha-sgp', teams.thailand, teams.singapore, groups.groupA, stadiums.raj, '2026-12-01 20:00:00', 'FINISHED', 1, 1],
    ['vie-sgp', teams.vietnam, teams.singapore, groups.groupA, stadiums.myDinh, '2026-12-05 19:30:00', 'FINISHED', 1, 0],
    ['tha-lao', teams.thailand, teams.laos, groups.groupA, stadiums.raj, '2026-12-05 20:00:00', 'FINISHED', 3, 0],
    ['vie-tha', teams.vietnam, teams.thailand, groups.groupA, stadiums.myDinh, '2026-12-09 19:30:00', 'FINISHED', 1, 1],
    ['sgp-lao', teams.singapore, teams.laos, groups.groupA, stadiums.raj, '2026-12-09 20:00:00', 'FINISHED', 2, 1],
    ['mas-cam', teams.malaysia, teams.cambodia, groups.groupB, stadiums.bukit, '2026-12-02 19:30:00', 'FINISHED', 2, 0],
    ['idn-phi', teams.indonesia, teams.philippines, groups.groupB, stadiums.gbk, '2026-12-02 20:00:00', 'FINISHED', 2, 1],
    ['mas-phi', teams.malaysia, teams.philippines, groups.groupB, stadiums.bukit, '2026-12-06 19:30:00', 'FINISHED', 1, 1],
    ['idn-cam', teams.indonesia, teams.cambodia, groups.groupB, stadiums.gbk, '2026-12-06 20:00:00', 'FINISHED', 3, 1],
    ['mas-idn', teams.malaysia, teams.indonesia, groups.groupB, stadiums.bukit, '2026-12-10 19:30:00', 'FINISHED', 0, 1],
    ['phi-cam', teams.philippines, teams.cambodia, groups.groupB, stadiums.gbk, '2026-12-10 20:00:00', 'FINISHED', 2, 2],
    ['sf1', teams.vietnam, teams.malaysia, null, stadiums.myDinh, '2026-12-15 19:30:00', 'SCHEDULED', null, null, 'KNOCKOUT', 'SEMI_FINAL'],
    ['sf2', teams.indonesia, teams.thailand, null, stadiums.gbk, '2026-12-16 19:30:00', 'SCHEDULED', null, null, 'KNOCKOUT', 'SEMI_FINAL']
  ];

  const matches = {};

  for (const row of rows) {
    const [
      key,
      homeTeam,
      awayTeam,
      group,
      stadium,
      matchDate,
      status,
      homeScore,
      awayScore,
      stage = 'GROUP',
      round = 'GROUP_STAGE'
    ] = row;

    const data = {
      tournamentId: tournament.id,
      groupId: group?.id || null,
      stadiumId: stadium.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      refereeId: referee.id,
      matchDate,
      stage,
      round,
      status,
      homeScore,
      awayScore,
      winnerTeamId: winnerTeamId(homeTeam, awayTeam, homeScore, awayScore),
      notes: stage === 'GROUP' ? `${homeTeam.name} vs ${awayTeam.name} group stage` : `${homeTeam.name} vs ${awayTeam.name} semi-final`
    };

    matches[key] = await upsert(Match, {
      where: {
        tournamentId: tournament.id,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        round
      },
      data
    });
  }

  return matches;
}

async function seedMatchEvents(matches, players) {
  const eventMinutes = {
    home: [12, 34, 67, 82],
    away: [23, 55, 73, 88]
  };

  for (const match of Object.values(matches)) {
    if (match.status !== 'FINISHED') continue;

    await createGoalEvents(match, match.homeTeamId, match.homeScore, eventMinutes.home, players);
    await createGoalEvents(match, match.awayTeamId, match.awayScore, eventMinutes.away, players);

    await upsert(MatchEvent, {
      where: {
        matchId: match.id,
        minute: 45,
        type: 'YELLOW_CARD',
        teamId: match.awayTeamId
      },
      data: {
        matchId: match.id,
        teamId: match.awayTeamId,
        playerId: findPlayerByTeamId(players, match.awayTeamId, 'DF')?.id || null,
        minute: 45,
        type: 'YELLOW_CARD',
        description: 'Tactical foul near midfield'
      }
    });
  }
}

async function createGoalEvents(match, teamId, goalCount, minutes, players) {
  for (let index = 0; index < goalCount; index += 1) {
    const minute = minutes[index] || 89;
    const scorer = findPlayerByTeamId(players, teamId, index % 2 === 0 ? 'FW' : 'MF');

    await upsert(MatchEvent, {
      where: {
        matchId: match.id,
        minute,
        type: 'GOAL',
        teamId
      },
      data: {
        matchId: match.id,
        teamId,
        playerId: scorer?.id || null,
        minute,
        type: 'GOAL',
        description: `Goal ${index + 1}`
      }
    });
  }
}

function findPlayerByTeamId(players, teamId, preferredPosition) {
  const teamPlayers = Object.values(players).flat().filter((player) => player.teamId === teamId);
  return teamPlayers.find((player) => player.position === preferredPosition) || teamPlayers[0];
}

function winnerTeamId(homeTeam, awayTeam, homeScore, awayScore) {
  if (homeScore === null || awayScore === null || homeScore === awayScore) return null;
  return homeScore > awayScore ? homeTeam.id : awayTeam.id;
}

async function seedNews(admin) {
  const rows = [
    {
      title: 'AFF Cup 2026 group stage opens in Hanoi',
      slug: 'aff-cup-2026-group-stage-opens-in-hanoi',
      content: 'The tournament starts with Group A matches and a full stadium schedule across ASEAN venues.',
      type: 'NEWS',
      status: 'PUBLISHED',
      publishedAt: '2026-11-20 08:00:00'
    },
    {
      title: 'Semi-final schedule confirmed',
      slug: 'semi-final-schedule-confirmed',
      content: 'Vietnam meet Malaysia in the first semi-final, while Indonesia face Thailand in the second semi-final.',
      type: 'ANNOUNCEMENT',
      status: 'PUBLISHED',
      publishedAt: '2026-12-11 09:00:00'
    },
    {
      title: 'Referee briefing completed before knockout stage',
      slug: 'referee-briefing-completed-before-knockout-stage',
      content: 'Match officials completed the tournament operations briefing before the knockout stage.',
      type: 'NEWS',
      status: 'PUBLISHED',
      publishedAt: '2026-12-12 14:30:00'
    }
  ];

  for (const row of rows) {
    await upsert(News, {
      where: { slug: row.slug },
      data: { ...row, authorId: admin.id }
    });
  }
}

async function seedNotifications(users) {
  const rows = [
    [users.admin.id, 'Database seeded', 'AFF Cup demo data is ready for review.', 'SYSTEM', true],
    [users.organizer.id, 'Semi-finals generated', 'Review the knockout fixtures before publishing.', 'MATCH', false],
    [users.referee.id, 'Match assignment', 'You are assigned as demo referee for seeded fixtures.', 'MATCH', false],
    [users.user.id, 'New tournament news', 'Semi-final schedule has been published.', 'NEWS', false]
  ];

  for (const [userId, title, message, type, isRead] of rows) {
    await upsert(Notification, {
      where: { userId, title },
      data: { userId, title, message, type, isRead }
    });
  }
}

async function countSeedData() {
  return {
    users: await User.count(),
    roles: await Role.count(),
    tournaments: await Tournament.count(),
    groups: await Group.count(),
    teams: await Team.count(),
    players: await Player.count(),
    stadiums: await Stadium.count(),
    matches: await Match.count(),
    matchEvents: await MatchEvent.count(),
    standings: await Standing.count(),
    news: await News.count(),
    notifications: await Notification.count()
  };
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
