import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import PostDetails from "./pages/PostDetails";
import UserSearchResults from "./pages/UserSearchResults";
import NewPost from "./pages/NewPost";
import NavBar from "./pages/components/NavBar";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { token } = useAuth();

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/posts" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/posts" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/posts" />} />
        <Route path="/posts" element={token ? <Posts /> : <Navigate to="/login" />} />
        <Route path="/my-posts" element={token ? <MyPosts /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/posts/:id" element={token ? <PostDetails /> : <Navigate to="/login" />} />
        <Route path="/users/:id" element={token ? <PublicProfile /> : <Navigate to="/login" />} />
        <Route path="/search-users" element={token ? <UserSearchResults /> : <Navigate to="/login" />} />
        <Route path="/new-post" element={token ? <NewPost /> : <Navigate to="/login" />} />
        <Route path="/edit-post/:id" element={token ? <NewPost /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

