import { Box, Typography } from "@mui/material"
import { useContext } from "react";
import { GitContext } from "../provider/git.provider";

export const FilesView = () => {
    const gitContext = useContext(GitContext)

    const gitFlatLogs = gitContext.getGitFlatLogs();

    return (
        <Box display={'flex'} flexDirection={'column'} p={1}>
            {gitFlatLogs
                .sort((a, b) => (b.path.localeCompare(a.path)))
                .map((gitFlatLog, index) => (
                    <Box display={'flex'}>
                        <Typography
                            textAlign={'left'}
                            variant={'caption'}
                            key={index}
                            sx={{
                                textDecoration: (gitFlatLog.totalDeleted > 0 ? 'line-through' : null)
                            }}>
                            {gitFlatLog.path.replace(gitFlatLog.file, '')}
                        </Typography>
                        <Typography
                            textAlign={'left'}
                            variant={'caption'}
                            key={index}
                            sx={{
                                textDecoration: (gitFlatLog.totalDeleted > 0 ? 'line-through' : null),
                                color: colors(gitFlatLog.file)
                            }}>
                            {gitFlatLog.file}
                        </Typography>
                    </Box>
                ))}
        </Box>
    );
}

const colors = (filename: string): string => {
    if (filename.includes('.tsx')) {
        return '#00FF00'
    }
    if (filename.includes('.ts')) {
        return '#00FFff'
    }
    if (filename.includes('.json')) {
        return '#f0f'
    }

    return '#FFF'
}