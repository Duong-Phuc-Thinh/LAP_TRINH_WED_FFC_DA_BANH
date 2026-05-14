import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/public/HomePage';
import SchedulePage from '../pages/public/SchedulePage';
import ResultsPage from '../pages/public/ResultsPage';
import TeamsPage from '../pages/public/TeamsPage';
import TeamDetailPage from '../pages/public/TeamDetailPage';
import StandingsPage from '../pages/public/StandingsPage';
import NewsPage from '../pages/public/NewsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardHomePage from '../pages/dashboard/DashboardHomePage';
import ResultUpdatePage from '../pages/dashboard/ResultUpdatePage';
import StandingAdminPage from '../pages/dashboard/StandingAdminPage';
import BracketPage from '../pages/dashboard/BracketPage';
import {
  EventManagementPage,
  GroupManagementPage,
  MatchManagementPage,
  NewsManagementPage,
  PlayerManagementPage,
  StadiumManagementPage,
  TeamManagementPage,
  TournamentManagementPage,
  UserManagementPage
} from '../pages/dashboard/ManagementPages';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="matches" element={<SchedulePage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="teams/:id" element={<TeamDetailPage />} />
          <Route path="standings" element={<StandingsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute roles={['ADMIN', 'ORGANIZER', 'REFEREE']} />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route element={<ProtectedRoute roles={['ADMIN', 'ORGANIZER']} />}>
                <Route index element={<DashboardHomePage />} />
              </Route>
              <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                <Route path="users" element={<UserManagementPage />} />
              </Route>
              <Route element={<ProtectedRoute roles={['ADMIN', 'ORGANIZER']} />}>
                <Route path="tournaments" element={<TournamentManagementPage />} />
                <Route path="groups" element={<GroupManagementPage />} />
                <Route path="teams" element={<TeamManagementPage />} />
                <Route path="players" element={<PlayerManagementPage />} />
                <Route path="stadiums" element={<StadiumManagementPage />} />
                <Route path="matches" element={<MatchManagementPage />} />
                <Route path="standings" element={<StandingAdminPage />} />
                <Route path="bracket" element={<BracketPage />} />
                <Route path="news" element={<NewsManagementPage />} />
              </Route>
              <Route element={<ProtectedRoute roles={['ADMIN', 'REFEREE']} />}>
                <Route path="results" element={<ResultUpdatePage />} />
                <Route path="events" element={<EventManagementPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
