import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import axios from "axios";
import { MdAddAlarm } from "react-icons/md";

export default function App() {
  const [additionalData, setAdditionalData] = useState([]);

  const [selectedPlanner, setSelectedPlanner] = useState("");
  const [updatedData, setUpdatedData] = useState([]);

  // Definiowanie tablicy z nazwami kolumn i ich szerokościami
  const [customColumnWidths, setCustomColumnWidths] = useState([
    { columnName: "Uwagi", width: 550 },
    { columnName: "Historia", width: 250 },
    { columnName: "Do_księgowości", width: 110 },
  ]);
  const [checkboxStates, setCheckboxStates] = useState({});
  useEffect(() => {
    const initialCheckboxStates = {};
    additionalData.forEach((data, index) => {
      initialCheckboxStates[index] = false;
    });
    setCheckboxStates(initialCheckboxStates);
  }, [additionalData]);

  const getAccess = async () => {
    try {
      const response = await axios.post("http://localhost:5000/get_access");
      setAdditionalData(response.data);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:5000/get_access");
        setAdditionalData(response.data);
      } catch (error) {
        console.error("Wystąpił błąd:", error);
      }
    };
    fetchData();
  }, []);

  const [columns, setColumns] = useState([]);

  // useMemo do obliczania wartości kolumn na podstawie additionalData
  // useMemo do obliczania wartości kolumn na podstawie additionalData

  const memoizedColumns = useMemo(() => {
    // Definiowanie specjalnych kolumn
    const specialColumns = [
      {
        title: "Do_księgowości",
        kind: GridCellKind.Boolean,
        width:
          customColumnWidths.find((c) => c.columnName === "Do_księgowości")
            ?.width || 110,
      },
      {
        title: "Uwagi",
        kind: GridCellKind.Text,
        width:
          customColumnWidths.find((c) => c.columnName === "Uwagi")?.width ||
          550,
        themeOverride: {
          textDark: "#009CA6",
          bgIconHeader: "#fff",
        },
      },
      {
        title: "Historia",
        kind: GridCellKind.Custom,
        width:
          customColumnWidths.find((c) => c.columnName === "Historia")?.width ||
          250,
      },
    ];

    // Dodanie pozostałych kolumn
    const otherColumns = additionalData[0]
      ? Object.keys(additionalData[0])
          .map((key) => {
            if (["Dla_księgowości", "Uwagi", "Historia"].includes(key))
              return null; // Pomijanie specjalnych kolumn

            const customWidth =
              customColumnWidths.find((c) => c.columnName === key)?.width ||
              200;
            return { title: key, width: customWidth };
          })
          .filter(Boolean) // Usuwanie wartości null
      : [];

    // Łączenie specjalnych i pozostałych kolumn
    return [...specialColumns, ...otherColumns];
  }, [additionalData, customColumnWidths]);

  const getCellContent = ([col, row]) => {
    if (col === 0) {
      return { kind: GridCellKind.Boolean, data: checkboxStates[row] };
    }

    const cellData = filteredData[row][columns[col].title];

    // Dodaj ten fragment
    // if (columns[col].title === "Uwagi" && filteredData[row]["Historia"]) {
    //   console.log("z historii do uwag");
    //   return {
    //     kind: GridCellKind.Text,
    //     displayData: filteredData[row]["Historia"][0] || "",
    //     allowOverlay: true,
    //     data: filteredData[row]["Historia"][0] || "",
    //   };
    // }
    // Reszta funkcji pozostaje bez zmian
    return Array.isArray(cellData)
      ? { kind: GridCellKind.Custom, data: cellData, allowOverlay: false }
      : {
          kind: GridCellKind.Text,
          displayData: cellData,
          allowOverlay: true,
          data: cellData,
        };
  };

  const CustomArrayCellRenderer = useMemo(
    () => ({
      isMatch: (cell) => cell.kind === GridCellKind.Custom,
      draw: (args, cell) => {
        const { ctx, rect } = args;
        cell.data.forEach((line, index, array) => {
          // Sprawdzanie, czy komórka zawiera historię i czy jest to pierwszy element
          if (columns[args.col].title === "Historia" && index === 0) {
            ctx.fillStyle = "#222"; // Kolor tekstu dla pierwszego elementu
            ctx.font = " 13.6px Arial"; // Pogrubienie dla pierwszego elementu
          } else {
            ctx.fillStyle = "#555"; // Domyślny kolor tekstu
            ctx.font = "13.6px Arial"; // Domyślna czcionka
          }

          const lineY = rect.y + (rect.height / array.length) * (index + 0.5);
          ctx.fillText(line, rect.x + 10, lineY); // Odstęp od lewej krawędzi
        });
        return true;
      },
    }),
    [columns] // Dodanie zależności od columns
  );

  const updateAccess = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/update_access",
        data
      );
      console.log(response.data); // Logowanie odpowiedzi z serwera
      getAccess();
    } catch (error) {
      console.error("Wystąpił błąd podczas aktualizacji dostępu:", error);
      throw error;
    }
  };
  const onCellEdited = ([col, row], newValue) => {
    // Znalezienie oryginalnego indeksu w additionalData
    const originalRow = additionalData.findIndex(
      (item) => item === filteredData[row]
    );

    if (newValue.kind === GridCellKind.Boolean) {
      setCheckboxStates((prev) => ({ ...prev, [originalRow]: newValue.data }));
    }

    if (newValue.kind === GridCellKind.Text && columns[col].title === "Uwagi") {
      const updatedDataa = additionalData.map((item, idx) => {
        if (idx === originalRow) {
          return { ...item, Uwagi: newValue.data };
        }
        return item;
      });

      // Ustawienie zaktualizowanych danych
      setAdditionalData(updatedDataa);

      // Opcjonalnie: Wysyłanie zaktualizowanych danych do serwera

      setUpdatedData(updatedDataa);
    }

    // Opcjonalnie: Logowanie aktualnych danych z checkboxami
    logCurrentDataWithCheckboxes();
  };

  useEffect(() => {
    const initialCheckboxStates = { ...checkboxStates };
    additionalData.forEach((data, index) => {
      if (initialCheckboxStates[index] === undefined) {
        initialCheckboxStates[index] = false;
      }
    });
    setCheckboxStates(initialCheckboxStates);
  }, [additionalData]);

  const logCurrentDataWithCheckboxes = () => {
    const combinedData = additionalData.map((row, index) => ({
      ...row,
      checkbox: checkboxStates[index],
    }));

    console.log("Zaktualizowany stan danych z checkboxami:", combinedData);
    // updateAccess(combinedData);
  };
  const { drawCell } = useCustomCells([CustomArrayCellRenderer]);

  const onColumnResize = useCallback(
    (columnName, newSize) => {
      const updatedColumnWidths = customColumnWidths.map((column) =>
        column.columnName === columnName.title
          ? { ...column, width: newSize }
          : column
      );

      setCustomColumnWidths(updatedColumnWidths);
    },
    [customColumnWidths, setCustomColumnWidths]
  );
  ////

  const planners = useMemo(() => {
    const plannerSet = new Set();
    additionalData.forEach((data) => {
      if (data.Planista) {
        plannerSet.add(data.Planista);
      }
    });
    return Array.from(plannerSet);
  }, [additionalData]);

  const filteredData = useMemo(() => {
    return selectedPlanner
      ? additionalData.filter((data) => data.Planista === selectedPlanner)
      : additionalData;
  }, [additionalData, selectedPlanner]);
  ////
  const rowHeight = useMemo(() => {
    return (rowIndex) => {
      const rowData = filteredData[rowIndex];
      const baseHeight = 30; // Bazowa wysokość dla wiersza bez historii
      const padding = 0; // Dodajemy 10px na górę i 10px na dół

      if (rowData && rowData.Historia && rowData.Historia.length > 1) {
        // Jeśli wiersz zawiera historię, dostosowujemy jego wysokość
        return 20 * rowData.Historia.length + padding;
      }
      return baseHeight + padding; // Domyślna wysokość z paddingiem
    };
  }, [filteredData]);

  useEffect(() => {
    setColumns(memoizedColumns);
  }, [memoizedColumns, filteredData]); // Dodaj filteredData jako zależność

  const onRowAppended = () => {
    console.log("Dodano wiersz", e);
  };
  return (
    <div
      style={{ width: "100%", height: "calc(100vh - 45px)", overflow: "auto" }}
    >
      {/* Selektor planistów */}
      {/* <select
        value={selectedPlanner}
        onChange={(e) => setSelectedPlanner(e.target.value)}
      >
        <option value="">Wszyscy planiści</option>
        {planners.map((planner) => (
          <option key={planner} value={planner}>
            {planner}
          </option>
        ))}
      </select> */}
      <button onClick={() => updateAccess(updatedData)}>Zapisz</button>
      <DataEditor
        style={{ width: "100%", height: "100%" }}
        columns={columns}
        getCellContent={getCellContent}
        rows={filteredData.length}
        rowHeight={rowHeight}
        drawCell={drawCell}
        maxColumnAutoWidth={500}
        maxColumnWidth={2000}
        onCellEdited={onCellEdited}
        onColumnResize={onColumnResize}
        fillHandle={true}
        freezeColumns={2}
        keybindings={{ downFill: true, rightFill: true }}
        onRowAppended={(e) => console.log(e)}
        getRowThemeOverride={(i) =>
          i % 2 === 0
            ? undefined
            : {
                bgCell: "#f2f2f2",
              }
        }
      />
    </div>
  );
}

function useCustomCells(cells) {
  return useMemo(() => {
    const drawCell = (args) => {
      const { cell, rect } = args;
      const paddingTop = 3; // Ustawienie paddingu górnego
      const paddingBottom = 0; // Ustawienie paddingu dolnego

      // Zmiana pozycji renderowania komórki, aby uwzględnić padding górny i dolny
      args.rect = {
        ...rect,
        y: rect.y + paddingTop,
        height: rect.height - paddingTop - paddingBottom,
      };

      if (cell.kind !== GridCellKind.Custom) return false;
      for (const c of cells) {
        if (c.isMatch(cell)) {
          return c.draw(args, cell);
        }
      }
      return false;
    };
    return { drawCell };
  }, [cells]);
}
