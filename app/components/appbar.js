import { Inventory } from "@mui/icons-material";

const {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} = require("@mui/material");

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static" sx={{borderRadius:4}}>
        <Toolbar sx={{justifyContent:"center"}}>
          <Inventory sx={{ mr: 2 }} />
          <Typography  variant="h6">
            Inventory Management
          </Typography>
          
        </Toolbar>
      </AppBar >
    </Box>
  );
};
export default Navbar;

