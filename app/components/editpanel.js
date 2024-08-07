import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import AddForm from "./addcomp";
import PantryTable from "./table";

const EditPage = () => {
  const [view, setView] = useState(0);
  const handlechangetab = (event, newVal) => {
    setView(newVal);
  };
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };
  return (
    <Box marginTop={5}>
      <Tabs
        value={view}
        centered
        onChange={handlechangetab}
        sx={{ border: 1, borderColor: "purple", borderRadius: 4 }}
      >
        <Tab
          label="Add Inventory"
          sx={{ flex: 1, borderRadius: 25, color: "green", fontWeight: 800 }}
        />
        <Tab label="Edit / Delete" sx={{ flex: 1, borderRadius: 25, fontWeight: 800 ,color:"red" }} />
        
      </Tabs>
      {view == 0 && <AddForm onClose={handleRefresh}></AddForm>}
      {view == 1 && <PantryTable editmode={1} refresh={refresh}></PantryTable>}
    </Box>
  );
};

export default EditPage;
