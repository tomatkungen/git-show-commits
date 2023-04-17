import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { CheckboxLabel } from "../../components/checkbox-label/checkbox-label";
import { GitContext } from "../../provider/git.provider";

export const FilesView = () => {
    const [checkboxFilter, setCheckboxFilter] = useState<string[]>([]);
    const gitContext = useContext(GitContext)

    const gitFlatLogs = gitContext.getGitFlatLogs();
    const gitCommitFilesSuffix = gitContext.getGitCommitFilesSuffix();

    const handleCheckbox = (label: string, _: boolean) => {
        const index = checkboxFilter.indexOf(label);

        index === -1 && checkboxFilter.push(label);
        index > -1 && checkboxFilter.splice(index, 1);

        setCheckboxFilter([...checkboxFilter]);
    }

    return (
        <Box display={'flex'} flexDirection={'column'} p={1}>
            <Box display={'flex'} flexDirection={'row'}>
                {gitCommitFilesSuffix.map((gitCommitFileSuffix, index) => (
                    <CheckboxLabel
                        key={index}
                        onChange={handleCheckbox}
                        text={gitCommitFileSuffix} />
                ))
                }
            </Box>
            {gitFlatLogs
                .sort((a, b) => (b.path.localeCompare(a.path))).filter((gitFlatLog) => {                    
                    const suffix = gitFlatLog.file.split('.').pop() || '';
                    return !checkboxFilter.includes(`.${suffix}`)
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