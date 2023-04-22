import { Box, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Scroll } from "../../components/scroll/scroll";
import { GitContext } from "../../provider/git.provider";
import { FilterMenuSuffix } from "./filter-menu-suffix/filter-menu-suffix";

export const FilesView = () => {
    const [checkboxFilter, setCheckboxFilter] = useState<string[]>([]);
    const gitContext = useContext(GitContext)

    const gitFlatLogs = gitContext.getGitFlatLogs();
    const gitCommitFilesSuffix = gitContext.getGitCommitFilesSuffix();

    const handleCheckbox = (label: string) => {
        const index = checkboxFilter.indexOf(label);

        index === -1 && checkboxFilter.push(label);
        index > -1 && checkboxFilter.splice(index, 1);

        setCheckboxFilter([...checkboxFilter]);
    }

    return (
        <Box display={'flex'} flexDirection={'column'} p={1}>
            <FilterMenuSuffix
                suffixTypes={gitCommitFilesSuffix}
                onChange={handleCheckbox}
            />
            <Scroll>
                {gitFlatLogs
                    .sort((a, b) => (b.path.localeCompare(a.path)
                    )).filter((gitFlatLog) => {
                        const suffix = gitFlatLog.file.split('.').pop() || '';
                        return checkboxFilter.length === 0 || checkboxFilter.includes(`.${suffix}`)
                    })
                    .map((gitFlatLog, index) => (
                        <Box display={'flex'} key={index}>
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