import * as core from '@actions/core';
import * as github from '@actions/github';

interface Input {
  token: string;
  owner: string;
  repo: string;
  codeql: boolean;
}

export function getInputs(): Input {
  const result = {} as Input;
  result.token = core.getInput('github-token');
  result.owner = core.getInput('owner');
  result.repo = core.getInput('repo');
  result.codeql = core.getBooleanInput('codeql');
  return result;
}

const codeqlLanguageMapping = {
	"csharp": "csharp",
	"c#": "csharp",
	"cpp": "cpp",
	"c": "cpp",
	"c++": "cpp",
	"go": "go",
	"java": "java",
	"javascript": "javascript",
	"typescript": "javascript",
	"python": "python",
	"ruby": "ruby"
}

const run = async (): Promise<void> => {
  try {
    const input = getInputs();
    const octokit: ReturnType<typeof github.getOctokit> = github.getOctokit(input.token);
    const langResponse = await octokit.request(`GET /repos/${input.owner}/${input.repo}/languages`);
    core.debug(JSON.stringify({langResponse}))
    let languages = Object.keys(langResponse.data);
    if (input.codeql) {
      languages = languages.filter(l => codeqlLanguageMapping[l.toLowerCase()]);
    }
    core.setOutput('languages', JSON.stringify(languages));
  } catch (error) {
    core.startGroup(error instanceof Error ? error.message : JSON.stringify(error));
    core.info(JSON.stringify(error, null, 2));
    core.endGroup();
  }
};

export default run;
