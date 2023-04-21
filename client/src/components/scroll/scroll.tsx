import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

type ScrollProps = PropsWithChildren<{
    width?: React.CSSProperties['width']
}>

export const Scroll = ({ children, width }: ScrollProps) => {
    return (
        <Box sx={{ height: '600px', overflowY: 'auto', width }}>
            <Box>{children}</Box>
        </Box>
    );
}