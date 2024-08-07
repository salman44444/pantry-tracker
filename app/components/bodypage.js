import Image from "next/image";
import myimg from "@/public/lp.jpg";
import { PlusOne, ViewAgenda } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
const {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Stack,
} = require("@mui/material");

const PageBody = () => {
 
  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" spacing={2}>
        <Stack direction="column" spacing={2} justifyContent="center">
          <Typography variant="h2" sx={{ fontWeight: 800 }}>
            Smart, Simple Software for Inventory Management
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 400 }}>
            Add Delete Update all in one place
          </Typography>
      
        </Stack>
        <Image src={myimg} alt="landing page image" width={500} height={500} />
      </Stack>
    </Box>
  );
};

export default PageBody;
