"use client";
import { firestore } from "@/firebase";
import {
  Box,
  Button,
  Container,
  createTheme,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  CircularProgress, // Add CircularProgress for loading indicator
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { collection, Firestore, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import ResponsiveAppBar from "./components/appbar";
import Navbar from "./components/appbar";
import PantryTable from "./components/table";
import PageBody from "./components/bodypage";
import { CameraAlt, Edit, ViewAgenda } from "@mui/icons-material";
import EditPage from "./components/editpanel";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [value, setValue] = useState(0);
  const [recipies, setRecipies] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const myTheme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#42a5f5",
      },
      background: {
        default: "#f5f5f5",
      },
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      h6: {
        fontWeight: 700,
      },
      button: {
        textTransform: "none",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#1976d2",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px",
          },
          containedPrimary: {
            color: "#fff",
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid #e0e0e0",
          },
          indicator: {
            backgroundColor: "#1976d2",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 700,
          },
        },
      },
    },
  });

  const getcurrentData = async () => {
    const snapshot = query(collection(firestore, "pantryItems"));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map((doc) => {
      const { name, quantity } = doc.data();
      return { name, quantity };
    });
    return inventoryList;
  };

  const getrecipies = async () => {
    setLoading(true); // Set loading to true
    const currentInventory = await getcurrentData();
    const inventoryString = currentInventory
      .map((item) => `${item.name}: ${item.quantity}`)
      .join(", ");

    fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer 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`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: "user",
            content: `Hi suggest me recipies based on the items i have and these items are ${inventoryString}`,
          },
        ],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setRecipies(data.choices[0].message.content.replace(/\*\*/g, ""));

        setLoading(false); // Set loading to false
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false); // Set loading to false
      });
  };

  const handlechangetab = (event, newVal) => {
    setValue(newVal);
  };

  return (
    <ThemeProvider theme={myTheme}>
      <Container>
        <Navbar></Navbar>
        <Box>
          <Tabs
            centered
            sx={{
              display: "flex",
              justifyContent: "space-between",
              my: 2,
              alignItems: "center",
              borderRadius: 3,
            }}
            value={value}
            textColor="primary"
            onChange={handlechangetab}
          >
            <Tab
              label="View Inventory"
              sx={{ fontWeight: 800, flex: 1, textAlign: "center", mx: 5 }}
            />
            <Tab
              label="Edit Inventory"
              sx={{ fontWeight: 800, flex: 1, textAlign: "center", mx: 5 }}
            />
          </Tabs>
        </Box>

        {value == 0 && <PantryTable editmode={0}></PantryTable>}
        {value == 1 && <EditPage></EditPage>}

        <Box sx={{ margin: 5, display: "flex", justifyContent: "center" }}>
          <Button variant="outlined" onClick={getrecipies}>
            Get Recipes
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", margin: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && recipies !== "" && value !==1 &&  (
          <Box sx={{ margin: 5 }}>
            <Typography variant="h6" gutterBottom>
              Recipes:
            </Typography>
            <div>
              {recipies.split("\n\n").map((recipe, index) => (
                <Card key={index} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    {recipe.split("\n").map((line, i) => (
                      <Typography key={i} variant={i === 0 ? "h6" : "body1"}>
                        {line}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}
