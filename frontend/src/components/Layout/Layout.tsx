import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Header } from "@/components/Header/Header";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import { Footer } from "@/components/Footer/Footer";
import { useProfile } from "@/hooks/useProfile";

export const Layout: React.FC = () => {
  const { user } = useProfile();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default" }}>
        <Outlet />
      </Box>
      {/* Show chat widget only for authenticated users */}
      {user?.isLoggedIn && <ChatWidget />}
      <Footer />
    </Box>
  );
};
