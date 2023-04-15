import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

type ScrollProps = PropsWithChildren<{}>

export const Scroll = ({ children }: ScrollProps) => {
    return (
        <Box sx={{ height: '600px', overflowY: 'auto' }}>
            <Box>{children}</Box>
        </Box>
    );
}