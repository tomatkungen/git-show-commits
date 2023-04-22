import { Box, Divider, Stack, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useContext, useState } from "react";
import logs from '../../../../log.json';
import { Scroll } from "../../components/scroll/scroll";
import { GitContext } from "../../provider/git.provider";
import { CardCommit } from "./card-commit/card-commit";

export const CommitView = () => {
    const [selectedCommitIndex, setSelectedCommitIndex] = useState<number>(-1);
    const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);

    const gitContext = useContext(GitContext)

    const handleClickFile = (index: number) => {
        setSelectedFileIndex(index);
    }

    const handleClickCommit = (index: number) => {
        setSelectedCommitIndex(index);
    }

    const renderGitCommits = (fileIndex: number) => {
        return (
            <>
                {fileIndex === -1 && <CardCommit title={`<- Select`} textAlign={'center'} />}
                {fileIndex !== -1 &&
                    gitContext
                        .getGitCommitsByHash(gitFlatLogs[selectedFileIndex].hash)
                        .map(({ author }) => (
                            <CardCommit
                                title={author.commit}
                                subTitle={`${author.name} (${author.email})`}
                                key={author.hash}
                                textAlign={'center'}
                                cardContentChild={
                                    <Box display={'flex'} flexDirection={'column'}>
                                        <Typography variant={'caption'}>
                                            {`Commit - ${formatDistanceToNow(new Date(author.date))}`}
                                        </Typography>
                                        <Typography variant={'caption'}>
                                            {`hash - ${author.hash}`}
                                        </Typography>
                                    </Box>
                                }
                            />
                        ))
                }
            </>
        )
    }

    const renderGitFiles = (commitIndex: number) => {
        return (
            <>
                {commitIndex === -1 && <CardCommit title={`Select ->`} textAlign={'center'} />}
                {commitIndex !== -1 &&
                    gitContext
                        .getGitCommitFilesByHash(logs[commitIndex].author.hash)
                        .map((log, index) => (
                            <CardCommit
                                title={<Box sx={{ textDecoration: (log.totalDeleted >= 1 ? 'line-through' : '') }}>{`${log.file.toUpperCase()} (${log.totalCommits})`}</Box>}
                                subTitle={
                                    <Box>
                                        <Box>{log.path.replace(log.file, '')}</Box>
                                        {log.strikePaths.map((strikePath, index) => (
                                            <Box
                                                key={index}
                                                sx={{ textDecoration: 'line-through' }}>
                                                {strikePath.replace(log.file, '')}
                                            </Box>
                                        ))}
                                    </Box>
                                }
                                key={index}
                                textAlign={'center'}
                                cardContentChild={
                                    <Box display={'flex'} flexDirection={'column'}>
                                        <Typography variant={'caption'} textAlign={'right'}>{`Commits - ${log.totalCommits}`}</Typography>
                                        <Typography variant={'caption'} textAlign={'right'}>{`Deleted - ${log.totalDeleted}`}</Typography>
                                        <Typography variant={'caption'} textAlign={'right'}>{`Added - ${log.totalAdded}`}</Typography>
                                        <Typography variant={'caption'} textAlign={'right'}>{`Modied - ${log.totalModified}`}</Typography>
                                        <Typography variant={'caption'} textAlign={'right'}>{`Copy - ${log.totalCopied}`}</Typography>
                                        <Typography variant={'caption'} textAlign={'right'}>{`Rename - ${log.totalRenamed}`}</Typography>
                                    </Box>
                                }
                            />
                        ))
                }
            </>
        )
    }

    const gitFlatLogs = gitContext.getGitFlatLogs();

    return (
        <Stack direction={'row'}>
            <Scroll width={'25%'}>
                {gitFlatLogs.map(({ file, path, totalCommits, strikePaths, totalDeleted }, index) => (
                    <CardCommit
                        key={index}
                        index={index}
                        selected={selectedFileIndex === index}
                        title={<Box sx={{ textDecoration: (totalDeleted >= 1 ? 'line-through' : '') }}>{`${file.toUpperCase()} (${totalCommits})`}</Box>}
                        subTitle={
                            <Box>
                                <Box>{path.replace(file, '')}</Box>
                                {strikePaths.map((strikePath, index) => (
                                    <Box
                                        key={index} 
                                        sx={{ textDecoration: 'line-through' }}>
                                        {strikePath.replace(file, '')}
                                    </Box>
                                ))}
                            </Box>
                        }
                        onClick={handleClickFile}
                    />
                ))}
            </Scroll>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Scroll width={'25%'}>
                {renderGitCommits(selectedFileIndex)}
            </Scroll>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Scroll width={'25%'}>
                {renderGitFiles(selectedCommitIndex)}
            </Scroll>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Scroll width={'25%'}>
                {logs.map(({ author }, index) => (
                    <CardCommit /* 7 - 13 */
                        key={index}
                        index={index}
                        selected={selectedCommitIndex === index}
                        title={author.commit}
                        subTitle={`${author.name} (${author.email})`}
                        onClick={handleClickCommit}
                    />
                ))}
            </Scroll>
        </Stack>
    );
}
