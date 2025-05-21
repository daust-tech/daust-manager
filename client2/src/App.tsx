import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthProvider } from "./lib/auth";
import { Login } from "./pages/auth/Login";
import { Classes } from "./pages/Classes";
import { Courses } from "./pages/Courses";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Rooms } from "./pages/Rooms";
import { Schedules } from "./pages/Schedules";
import { Settings } from "./pages/Settings";
import { Users } from "./pages/Users";

export function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Users />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Courses />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/classes"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Classes />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Schedules />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Rooms />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
