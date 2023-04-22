import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { CheckboxLabel } from "../../../components/checkbox-label/checkbox-label";

type FilterMenuSuffixProps = {
    suffixTypes: string[];
    onChange: (label: string) => void;
}

export const FilterMenuSuffix = ({
    suffixTypes,
    onChange
}: FilterMenuSuffixProps) => {
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
                {'SHOW SUFFIX'}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ height: '300px' }}>

                {suffixTypes.map((suffixType, index) => (
                    <MenuItem>
                        <CheckboxLabel
                            key={index}
                            onChange={onChange}
                            text={suffixType} />
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}