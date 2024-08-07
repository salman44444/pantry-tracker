import { firestore } from "@/firebase";
import categories from "@/app/components/editpanel";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
  TablePagination,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import AddForm from "./addcomp";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { collection, deleteDoc, doc, getDoc, getDocs, query } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Refresh } from "@mui/icons-material";
const PantryTable = ({ editmode, Refresh }) => {
  const [inventory, setinventory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = [
    "Fruits",
    "Vegetables",
    "Dairy",
    "Bakery",
    "Meat",
    "Beverages",
    "General",
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [editItem, setEditItem] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const handleEditClick = (item) => {
    setEditItem(item);
    setOpenEditDialog(true);
  };
  const filterInventory = () => {
    return inventory.filter((item) => {
      const matchesSearchQuery = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? item.category === selectedCategory
        : true;
      return matchesSearchQuery && matchesCategory;
    });
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const filteredInventory = filterInventory();

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditItem(null);
  };
  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, "pantryItems"));
      const docs = await getDocs(snapshot);
      const inventoryList = docs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Updated inventory:", inventoryList);
      setinventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
  };
  

const deleteItem = async (item) => {
  try {
    console.log("Attempting to delete item with ID:", item.id); // Log the ID
    const itemDoc = doc(firestore, "pantryItems", item.id);
    console.log("Document path:", itemDoc.path); // Log the document path

    // Check if document exists
    const docSnapshot = await getDoc(itemDoc);
    if (docSnapshot.exists()) {
      console.log("Document data before deletion:", docSnapshot.data());
      await deleteDoc(itemDoc);
      console.log("Item deleted successfully!");
    } else {
      console.log("Document does not exist!");
    }

    await updateInventory(); // Ensure this is awaited
  } catch (error) {
    console.error("Error deleting item: ", error);
  }
};
  
  
  useEffect(() => {
    updateInventory();
  }, [Refresh]);

  return (
    <Stack>
      {editmode == 0 && (
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FormControl variant="outlined">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      <Box marginTop={5}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple Table">
            <TableHead>
              <TableRow>
                <TableCell>----</TableCell>
                <TableCell align="right">ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                {editmode == 1 && <TableCell align="right">-----</TableCell>}
                {editmode == 1 && <TableCell align="right">-----</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Image
                        src={item.pictureURL}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                    </TableCell>
                    <TableCell align="right">{item.id}</TableCell>
                    <TableCell align="right">{item.name}</TableCell>
                    <TableCell align="right">{item.category}</TableCell>
                    <TableCell align="right">{item.price}$</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    {editmode == 1 && (
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          sx={{ borderRadius: 25 }}
                          onClick={() => handleEditClick(item)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    )}
                    {editmode == 1 && (
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          sx={{ borderRadius: 25, backgroundColor: "red" }}
                          onClick={() => deleteItem(item)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Item</DialogTitle>
                <DialogContent>
                  <AddForm
                    initialData={editItem}
                    onClose={handleCloseEditDialog}
                  />
                </DialogContent>
              </Dialog>
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredInventory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Stack>
  );
};

export default PantryTable;
