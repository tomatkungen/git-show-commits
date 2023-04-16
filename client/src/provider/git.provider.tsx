import React from "react";
import logs from '../../../log.json';

type GitProviderProps = React.PropsWithChildren<{}>

type FlatLog = {
    file: string;
    path: string;
    names: string[];
    emails: string[];
    commits: string[];
    hash: string[];
    totalCommits: number;
    totalDeleted: number;
    totalAdded: number;
    totalModified: number;
};

type GitCreateContext = {
    getGitFlatLogs(): FlatLog[];
    getGitCommitsByHash(hash: string[]): typeof logs;
    getGitCommitFilesByHash(hash: string): FlatLog[];
}

export const GitContext = React.createContext<GitCreateContext>({
    getGitFlatLogs: () => [],
    getGitCommitsByHash: () => [],
    getGitCommitFilesByHash: () => []
});

export const GitProvider = ({ children }: GitProviderProps) => {

    const getGitFlatLogs = (): FlatLog[] => (gitFlatLogs());
    const getGitCommitsByHash = (hash: string[]): typeof logs => (gitCommitsByHash(hash));
    const getGitCommitFilesByHash = (hash: string): FlatLog[] => (gitCommitFilesByHash(hash));

    return (
        <GitContext.Provider value={{
            getGitFlatLogs,
            getGitCommitsByHash,
            getGitCommitFilesByHash
        }}>
            {children}
        </GitContext.Provider>
    )
}

const gitCommitFilesByHash = (hash: string) => {
    return gitFlatLogs().filter((gitFlatLog) => (
        gitFlatLog.hash.includes(hash)
    ));
}

const gitCommitsByHash = (hash: string[]) => (
    logs.filter(({ author }) =>
        (hash.includes(author.hash)))
);

const gitFlatLogs = () => {
    return logs.reduce<FlatLog[]>((p, c) => {
        c.files.forEach(({ status, path }) => {
            const index = p.findIndex(({ path: absolutePath }) => (absolutePath === path))

            if (index === -1) {
                p.push({
                    file: path.split('/').pop() || '',
                    path,
                    names: [c.author.name],
                    emails: [c.author.email],
                    commits: [c.author.commit],
                    hash: [c.author.hash],
                    totalCommits: 1,
                    totalDeleted: (status === 'D' ? 1 : 0),
                    totalAdded: (status === 'A' ? 1 : 0),
                    totalModified: (status === 'M' ? 1 : 0)
                });

                return p;
            }

            p[index].totalCommits += 1;

            !p[index].names.includes(c.author.name) && p[index].names.push(c.author.name);
            !p[index].emails.includes(c.author.email) && p[index].emails.push(c.author.email);
            !p[index].commits.includes(c.author.commit) && p[index].commits.push(c.author.commit);
            !p[index].hash.includes(c.author.hash) && p[index].hash.push(c.author.hash);

            status === 'D' && (p[index].totalDeleted += 1);
            status === 'A' && (p[index].totalAdded += 1);
            status === 'M' && (p[index].totalModified += 1);

            return p;
        })

        return p;
    }, [])
}