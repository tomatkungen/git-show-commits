import { Box, Tab, Tabs, } from "@mui/material";
import { useState } from "react";
import { CommitView } from "../commit-view/commit-view";
import { FilesView } from "../files-view/files-view";


type TablePanelProps = React.PropsWithChildren<{
    index: number,
    value: number
}>

export const MainView = () => {
    const [tab, setTab] = useState(0);

    const handleChange = (_, newValue: number) => {
        setTab(newValue);
    }

    const TabPanel = ({ children, value, index }: TablePanelProps) => {
        return (
            <Box>
                {value === index && (
                    <Box>
                        {children}
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <Box>
            <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Commits" />
                <Tab label="Files" />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <CommitView />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <FilesView />
            </TabPanel>

        </Box>
    );
}