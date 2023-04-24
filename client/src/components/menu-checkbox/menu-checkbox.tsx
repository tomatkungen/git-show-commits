import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { CheckboxLabel } from "../checkbox-label/checkbox-label";

type MenuCheckboxProps = {
    title: string;
    labels: string[];
    onChange: (label: string) => void;
}

export const MenuCheckbox = ({
    title,
    labels,
    onChange
}: MenuCheckboxProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <Button onClick={handleClick}>
                {title}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ height: '300px' }}>

                {labels.map((label, index) => (
                    <MenuItem key={index}>
                        <CheckboxLabel
                            onChange={onChange}
                            text={label} />
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}