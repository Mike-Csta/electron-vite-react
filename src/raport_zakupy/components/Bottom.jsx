import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import axios from "axios";
import { MdAddAlarm } from "react-icons/md";
import {
  rp1_store,
  update_switch1,
  update_switch2,
  update_planners,
  update_isloading,
} from "../pullstate/rp1_store.jsx";
import bottom from "./bottom.css";
export default function App() {
  const [additionalData, setAdditionalData] = useState([]);
  const switch1 = rp1_store.useState((s) => s.switch1);
  const [selectedPlanner, setSelectedPlanner] = useState("");
  const [updatedData, setUpdatedData] = useState([]);
  const filteredData = useMemo(() => {
    return selectedPlanner
      ? additionalData.filter(
          (data) =>
            convertPolishChars(data.Planista) ===
            convertPolishChars(selectedPlanner)
        )
      : additionalData;
  }, [additionalData, selectedPlanner]);

  // Definiowanie tablicy z nazwami kolumn i ich szerokościami
  const top_select_target_value = rp1_store.useState(
    (s) => s.top_select_target_value
  );
  const [customColumnWidths, setCustomColumnWidths] = useState([
    { columnName: "Uwagi", width: 200 },
    { columnName: "Historia", width: 550 },
    { columnName: "Do_księgowosci", width: 35 },
  ]);

  const [checkboxStates, setCheckboxStates] = useState({});

  useEffect(() => {
    const initialCheckboxStates = {};
    additionalData.forEach((data, index) => {
      initialCheckboxStates[index] = data.Do_księgowosci === "Tak";
    });
    setCheckboxStates(initialCheckboxStates);
    console.log("initialCheckboxStates", initialCheckboxStates);
  }, [additionalData]);

  function convertPolishChars(str) {
    const polishCharMap = {
      ą: "a",
      ć: "c",
      ę: "e",
      ł: "l",
      ń: "n",
      ó: "o",
      ś: "s",
      ż: "z",
      ź: "z",
      Ą: "A",
      Ć: "C",
      Ę: "E",
      Ł: "L",
      Ń: "N",
      Ó: "O",
      Ś: "S",
      Ż: "Z",
      Ź: "Z",
    };

    return str
      .split("")
      .map((char) => polishCharMap[char] || char)
      .join("");
  }

  const getAccess = async () => {
    try {
      const response = await axios.post("http://localhost:5000/get_access");
      // Resetowanie kolumny "Uwagi" dla każdego elementu w odpowiedzi
      const dataWithClearedRemarks = response.data.map((item) => ({
        ...item,
        Uwagi: "", // Czyszczenie kolumny Uwagi
      }));
      setAdditionalData(dataWithClearedRemarks);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:5000/get_access");
        // Resetowanie kolumny "Uwagi" dla każdego elementu w odpowiedzi
        const dataWithClearedRemarks = response.data.map((item) => ({
          ...item,
          Uwagi: "", // Czyszczenie kolumny Uwagi
        }));
        setAdditionalData(dataWithClearedRemarks);

        // Aktualizacja stanu checkboxów na podstawie nowych danych
        const newCheckboxStates = {};
        response.data.forEach((item, index) => {
          newCheckboxStates[index] = item.Do_księgowosci === "Tak";
        });
        setCheckboxStates(newCheckboxStates);
        setTimeout(() => {
          update_isloading(false);
        }, 200);
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
        title: "Do_księgowosci",
        kind: GridCellKind.Boolean,
        width:
          customColumnWidths.find((c) => c.columnName === "Do_księgowosci")
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
            if (["Do_księgowosci", "Uwagi", "Historia"].includes(key))
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
    // Sprawdzenie, czy istnieje checkboxStates[row] dla kolumny 0
    if (col === 0) {
      if (checkboxStates[row] === undefined) {
        console.error("Brak danych dla checkboxStates w wierszu:", row);
        return { kind: GridCellKind.Boolean, data: false }; // Zwraca domyślną wartość, jeśli brak danych
      }
      return { kind: GridCellKind.Boolean, data: checkboxStates[row] };
    }

    // Sprawdzenie, czy istnieje filteredData[row] i columns[col]
    if (!filteredData[row] || !columns[col]) {
      console.error("Brak danych dla wiersza:", row, "lub kolumny:", col);
      return { kind: GridCellKind.Text, data: "" }; // Zwraca pusty tekst, jeśli brak danych
    }

    const cellData = filteredData[row][columns[col].title];

    // Twoje istniejące warunki i logika
    // (Możesz tu dodać więcej kodu, jeśli potrzebujesz)

    // Zwróć odpowiednią zawartość komórki
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

  useEffect(() => {
    updateAccess(updatedData);
    console.log("updatedDataaaaaaaa");
  }, [switch1]);

  const onCellEdited = ([col, row], newValue) => {
    // Znajdowanie odpowiadającego indeksu w oryginalnych danych
    const originalRow = additionalData.findIndex(
      (item) => item === filteredData[row]
    );
    if (originalRow === -1) {
      console.error("Nie znaleziono odpowiadających danych");
      return;
    }

    const updatedData = [...additionalData];
    const updatedRowData = { ...updatedData[originalRow] };

    if (
      columns[col].title === "Do_księgowosci" &&
      newValue.kind === GridCellKind.Boolean
    ) {
      updatedRowData.Do_księgowosci = newValue.data ? "Tak" : "Nie";
      // Aktualizacja checkboxStates dla przefiltrowanych danych
      const newCheckboxStates = { ...checkboxStates };
      newCheckboxStates[row] = newValue.data;
      setCheckboxStates(newCheckboxStates);
    } else if (newValue.kind === GridCellKind.Text) {
      updatedRowData[columns[col].title] = newValue.data;
    }

    updatedData[originalRow] = updatedRowData;
    setAdditionalData(updatedData);
    setUpdatedData(updatedData); // Tylko jeśli jest to konieczne
  };

  useEffect(() => {
    setSelectedPlanner(top_select_target_value);
  }, [top_select_target_value]);

  useEffect(() => {
    // Aktualizacja stanu checkboxów na podstawie przefiltrowanych danych
    const newCheckboxStates = { ...checkboxStates };
    filteredData.forEach((data, index) => {
      newCheckboxStates[index] = data.Do_księgowosci === "Tak";
    });
    setCheckboxStates(newCheckboxStates);
  }, [filteredData]);

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

  useEffect(() => {
    update_planners(planners);
  }, [planners]);
  ////
  const rowHeight = useMemo(() => {
    return (rowIndex) => {
      const rowData = filteredData[rowIndex];
      const baseHeight = 28; // Bazowa wysokość dla wiersza bez historii
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
