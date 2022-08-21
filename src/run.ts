import * as core from '@actions/core';
import * as github from '@actions/github';

interface Input {
  token: string;
  owner: string;
  repo: string;
}

export function getInputs(): Input {
  const result = {} as Input;
  result.token = core.getInput('github-token');
  result.owner = core.getInput('owner');
  result.repo = core.getInput('repo');
  return result;
}

const run = async (): Promise<void> => {
  try {
    const input = getInputs();
    const octokit: ReturnType<typeof github.getOctokit> = github.getOctokit(input.token);
    const langResponse = await octokit.request(`GET /repos/${input.owner}/${input.repo}/languages`);
    core.debug(JSON.stringify({langResponse}))
    const keys = Object.keys(langResponse.data);
    core.setOutput('languages', JSON.stringify(keys));
  } catch (error) {
    core.startGroup(error instanceof Error ? error.message : JSON.stringify(error));
    core.info(JSON.stringify(error, null, 2));
    core.endGroup();
  }
};

export default run;
