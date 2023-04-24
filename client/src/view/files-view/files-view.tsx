import { AppBar, Box, Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { MenuCheckbox } from "../../components/menu-checkbox/menu-checkbox";
import { Scroll } from "../../components/scroll/scroll";
import { Space } from "../../components/space/space";
import { GitContext } from "../../provider/git.provider";

export const FilesView = () => {
    const [showFiles, setShowFiles] = useState<string[]>([]);
    const [showAuthors, setShowAuthors] = useState<string[]>([]);

    const gitContext = useContext(GitContext)

    const handleFiles = (label: string) => {
        const index = showFiles.indexOf(label);

        index === -1 && showFiles.push(label);
        index > -1 && showFiles.splice(index, 1);

        setShowFiles([...showFiles]);
    }

    const handleAuthors = (label: string) => {
        const index = showAuthors.indexOf(label);

        index === -1 && showAuthors.push(label);
        index > -1 && showAuthors.splice(index, 1);

        setShowAuthors([...showAuthors]);
    }

    const gitFlatLogs = gitContext.getGitFlatLogs();
    const gitCommitFilesSuffix = gitContext.getGitCommitFilesSuffix();
    const gitAuthorNames = gitContext.getGitAuthorNames();

    return (
        <Box display={'flex'} flexDirection={'column'} p={1}>
            <AppBar position="static">
                <Stack direction={'row'}>
                    <MenuCheckbox
                        title={'SHOW FILES'}
                        labels={gitCommitFilesSuffix}
                        onChange={handleFiles}
                    />
                    <MenuCheckbox
                        title={'SHOW AUTHORS'}
                        labels={gitAuthorNames}
                        onChange={handleAuthors}
                    />
                </Stack>
            </AppBar>
            <Scroll>
                {gitFlatLogs
                    .sort((a, b) => (b.path.localeCompare(a.path)
                    )).filter((gitFlatLog) => {
                        const suffix = gitFlatLog.file.split('.').pop() || '';
                        return showFiles.length === 0 || showFiles.includes(`.${suffix}`)
                    }).filter((gitFlatLog) => {
                        return (
                            showAuthors.length === 0 ||
                            gitFlatLog.names.some((name) => (showAuthors.includes(name)))
                        );
                    })
                    .map((gitFlatLog, index) => (
                        <Box display={'flex'} key={index}>
                            {showAuthors.length >= 1 &&
                                <Typography
                                    textAlign={'left'}
                                    variant={'caption'}
                                    sx={{
                                        color: '#FAA'
                                    }}>
                                    {`[${gitFlatLog.names.filter((name) => (showAuthors.includes(name))).join(', ')}]`}<Space /><Space />
                                </Typography>
                            }
                            <Typography
                                textAlign={'left'}
                                variant={'caption'}
                                sx={{
                                    textDecoration: (gitFlatLog.totalDeleted > 0 ? 'line-through' : null),
                                    color: '#acacac'
                                }}>
                                {gitFlatLog.path.replace(gitFlatLog.file, '')}
                            </Typography>
                            <Typography
                                textAlign={'left'}
                                variant={'caption'}
                                sx={{
                                    textDecoration: (gitFlatLog.totalDeleted > 0 ? 'line-through' : null),
                                    color: colors(gitFlatLog.file)
                                }}>
                                {gitFlatLog.file}
                            </Typography>
                        </Box>
                    ))}
            </Scroll>
        </Box >
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