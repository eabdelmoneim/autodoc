import path from 'path';
import { AutodocRepoConfig } from '../../../types.js';
import { spinnerSuccess, updateSpinnerText } from '../../spinner.js';
import { convertJsonToMarkdown } from './convertJsonToMarkdown.js';
import { createVectorStore } from './createVectorStore.js';
import { processRepository } from './processRepository.js';

export const index = async ({
  orgName,
  repos,
  root,
  output,
  llms,
  ignore,
  filePrompt,
  folderPrompt,
  chatPrompt,
  contentType,
  targetAudience,
  linkHosted,
}: AutodocRepoConfig) => {
  const json = path.join(output, 'docs', 'json/');
  const markdown = path.join(output, 'docs', 'markdown/');
  const data = path.join(output, 'docs', 'data/');

  /**
   * Traverse the repository, call LLMS for each file,
   * and create JSON files with the results.
   */

  updateSpinnerText('Processing repository...');
  await processRepository({
    orgName,
    repos,
    root,
    output: json,
    llms,
    ignore,
    filePrompt,
    folderPrompt,
    chatPrompt,
    contentType,
    targetAudience,
    linkHosted,
  });
  updateSpinnerText('Processing repository...');
  spinnerSuccess();

  /**
   * Create markdown files from JSON files
   */
  updateSpinnerText('Creating markdown files...');
  await convertJsonToMarkdown({
    orgName,
    repos,
    root: json,
    output: markdown,
    llms,
    ignore,
    filePrompt,
    folderPrompt,
    chatPrompt,
    contentType,
    targetAudience,
    linkHosted,
  });
  spinnerSuccess();

  updateSpinnerText('Create vector files...');
  await createVectorStore({
    orgName,
    repos,
    root: markdown,
    output: data,
    llms,
    ignore,
    filePrompt,
    folderPrompt,
    chatPrompt,
    contentType,
    targetAudience,
    linkHosted,
  });
  spinnerSuccess();
};

export default {
  index,
};
