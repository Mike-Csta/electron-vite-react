import * as React from "react";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import MoreVert from "@mui/icons-material/MoreVert";
import Edit from "@mui/icons-material/InstallDesktopOutlined";
import DeleteForever from "@mui/icons-material/DeleteForever";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import { ipcRenderer } from "electron";

export default function CtxMenu({ ShortcutName, Name, args }) {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = React.useCallback((event, isOpen) => {
    event.stopPropagation();
    setOpen(isOpen);
  }, []);

  function handleMenuClick(e) {
    e.stopPropagation(); // Zapobiega propagacji zdarzenia do wyższych elementów DOM
    createSkrotPulpit(ShortcutName, Name, args);
  }

  function createSkrotPulpit(appPath, shortcutName, args) {
    ipcRenderer.send("create-desktop-shortcut", appPath, shortcutName, args);
  }

  // Odbieranie wyniku tworzenia skrótu
  ipcRenderer.on("shortcut-creation-result", (event, success) => {
    if (success) {
      console.log("Skrót został pomyślnie utworzony.");
    } else {
      console.error("Nie udało się utworzyć skrótu.");
    }
  });

  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "noramal", color: "neutral" } }}
        onClick={(e) => e.stopPropagation()} // Zatrzymuje propagację tutaj
      >
        <MoreVert />
      </MenuButton>
      <Menu placement="bottom-end" onClick={handleMenuClick}>
        <MenuItem>
          <ListItemDecorator>
            <Edit />
          </ListItemDecorator>
          Utwórz skrót na pulpicie
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
