import CrudPage from '../../components/CrudPage';

export function UserManagementPage() {
  return (
    <CrudPage
      title="User Management"
      resource="users"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'fullName', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
        { key: 'roles', label: 'Roles' }
      ]}
      fields={[
        { name: 'fullName', label: 'Full name', required: true },
        { name: 'email', label: 'Email', required: true },
        { name: 'phone', label: 'Phone' },
        { name: 'password', label: 'Password', requiredOnCreate: true },
        { name: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'LOCKED'] },
        { name: 'roles', label: 'Roles, comma separated', required: true }
      ]}
    />
  );
}

export function TournamentManagementPage() {
  return (
    <CrudPage
      title="Tournament Management"
      resource="tournaments"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'season', label: 'Season' },
        { key: 'status', label: 'Status' }
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'season', label: 'Season', required: true },
        { name: 'hostCountry', label: 'Host country' },
        { name: 'startDate', label: 'Start date', type: 'date', required: true },
        { name: 'endDate', label: 'End date', type: 'date', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'OPEN', 'ONGOING', 'FINISHED', 'CANCELED'] },
        { name: 'format', label: 'Format', type: 'select', options: ['GROUP_KNOCKOUT', 'LEAGUE'] }
      ]}
    />
  );
}

export function GroupManagementPage() {
  return (
    <CrudPage
      title="Group Management"
      resource="groups"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Group' },
        { key: 'tournament.name', label: 'Tournament' },
        { key: 'orderNo', label: 'Order' }
      ]}
      fields={[
        { name: 'tournamentId', label: 'Tournament ID', type: 'number', required: true },
        { name: 'name', label: 'Name', required: true },
        { name: 'orderNo', label: 'Order', type: 'number', required: true }
      ]}
    />
  );
}

export function TeamManagementPage() {
  return (
    <CrudPage
      title="Team Management"
      resource="teams"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'shortName', label: 'Short' },
        { key: 'group.name', label: 'Group' }
      ]}
      fields={[
        { name: 'tournamentId', label: 'Tournament ID', type: 'number', required: true },
        { name: 'groupId', label: 'Group ID', type: 'number' },
        { name: 'name', label: 'Name', required: true },
        { name: 'shortName', label: 'Short name', required: true },
        { name: 'countryCode', label: 'Country code' },
        { name: 'coachName', label: 'Coach' },
        { name: 'logoUrl', label: 'Logo URL' }
      ]}
    />
  );
}

export function PlayerManagementPage() {
  return (
    <CrudPage
      title="Player Management"
      resource="players"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'fullName', label: 'Name' },
        { key: 'shirtNumber', label: 'No.' },
        { key: 'position', label: 'Pos' },
        { key: 'team.shortName', label: 'Team' }
      ]}
      fields={[
        { name: 'teamId', label: 'Team ID', type: 'number', required: true },
        { name: 'fullName', label: 'Full name', required: true },
        { name: 'shirtNumber', label: 'Shirt number', type: 'number' },
        { name: 'position', label: 'Position', type: 'select', options: ['GK', 'DF', 'MF', 'FW'] },
        { name: 'birthDate', label: 'Birth date', type: 'date' },
        { name: 'nationality', label: 'Nationality' }
      ]}
    />
  );
}

export function StadiumManagementPage() {
  return (
    <CrudPage
      title="Stadium Management"
      resource="stadiums"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'city', label: 'City' },
        { key: 'country', label: 'Country' },
        { key: 'capacity', label: 'Capacity' }
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'city', label: 'City', required: true },
        { name: 'country', label: 'Country', required: true },
        { name: 'capacity', label: 'Capacity', type: 'number' },
        { name: 'address', label: 'Address' }
      ]}
    />
  );
}

export function MatchManagementPage() {
  return (
    <CrudPage
      title="Match Scheduling"
      resource="matches"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'matchDate', label: 'Date' },
        { key: 'homeTeam.shortName', label: 'Home' },
        { key: 'awayTeam.shortName', label: 'Away' },
        { key: 'status', label: 'Status' }
      ]}
      fields={[
        { name: 'tournamentId', label: 'Tournament ID', type: 'number', required: true },
        { name: 'groupId', label: 'Group ID', type: 'number' },
        { name: 'stadiumId', label: 'Stadium ID', type: 'number' },
        { name: 'homeTeamId', label: 'Home team ID', type: 'number', required: true },
        { name: 'awayTeamId', label: 'Away team ID', type: 'number', required: true },
        { name: 'refereeId', label: 'Referee ID', type: 'number' },
        { name: 'matchDate', label: 'Match date', type: 'datetime-local', required: true },
        { name: 'stage', label: 'Stage', type: 'select', options: ['GROUP', 'KNOCKOUT'] },
        { name: 'round', label: 'Round', type: 'select', options: ['GROUP_STAGE', 'QUARTER_FINAL', 'SEMI_FINAL', 'THIRD_PLACE', 'FINAL'] },
        { name: 'status', label: 'Status', type: 'select', options: ['SCHEDULED', 'LIVE', 'FINISHED', 'CANCELED'] }
      ]}
    />
  );
}

export function EventManagementPage() {
  return (
    <CrudPage
      title="Match Events"
      resource="match-events"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'matchId', label: 'Match' },
        { key: 'minute', label: 'Minute' },
        { key: 'type', label: 'Type' },
        { key: 'player.fullName', label: 'Player' }
      ]}
      fields={[
        { name: 'matchId', label: 'Match ID', type: 'number', required: true },
        { name: 'teamId', label: 'Team ID', type: 'number' },
        { name: 'playerId', label: 'Player ID', type: 'number' },
        { name: 'minute', label: 'Minute', type: 'number', required: true },
        { name: 'type', label: 'Type', type: 'select', options: ['GOAL', 'OWN_GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION', 'PENALTY', 'VAR', 'OTHER'] },
        { name: 'description', label: 'Description', type: 'textarea' }
      ]}
    />
  );
}

export function NewsManagementPage() {
  return (
    <CrudPage
      title="News and Announcement"
      resource="news"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' }
      ]}
      fields={[
        { name: 'authorId', label: 'Author ID', type: 'number' },
        { name: 'title', label: 'Title', required: true },
        { name: 'content', label: 'Content', type: 'textarea', required: true },
        { name: 'type', label: 'Type', type: 'select', options: ['NEWS', 'ANNOUNCEMENT'] },
        { name: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED'] },
        { name: 'publishedAt', label: 'Published at', type: 'datetime-local' }
      ]}
    />
  );
}
