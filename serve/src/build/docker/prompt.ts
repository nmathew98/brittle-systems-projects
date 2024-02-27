import {
	readFile,
	writeFile,
	copyFile,
	constants,
	stat,
} from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import inquirer from "inquirer";

import { findRootDir } from "../../utilities/root-dir.js";

export const prompt = async () => {
	if (await isRunningInDocker()) return;

	const projectRoot = findRootDir();

	const packageJsonBuffer = await readFile(`${projectRoot}/package.json`);
	const packageJsonString = packageJsonBuffer.toString();

	const packageJson = JSON.parse(packageJsonString);
	const indentation = getIndent(packageJsonString);

	const __dirname = fileURLToPath(new URL(".", import.meta.url));
	const filesToCopy = [
		{
			from: resolve(__dirname, "./templates/docker-compose-dev.yml"),
			to: `${projectRoot}/docker-compose-dev.yml`,
		},
		{
			from: resolve(__dirname, "./templates/docker-compose.yml"),
			to: `${projectRoot}/docker-compose.yml`,
		},
		{
			from: resolve(__dirname, "./templates/Dockerfile"),
			to: `${projectRoot}/Dockerfile`,
		},
		{
			from: resolve(__dirname, "./templates/Dockerfile-dev"),
			to: `${projectRoot}/Dockerfile-dev`,
		},
	];

	if (packageJson?.serve?.docker)
		filesToCopy.forEach(file =>
			copyFile(file.from, file.to, constants.COPYFILE_EXCL).catch(() => false),
		);

	if (
		packageJson?.serve?.docker !== null &&
		packageJson?.serve?.docker !== undefined
	)
		return;

	const answers: any = await pInquirer([
		{
			type: "confirm",
			name: "docker",
			message:
				"Would you like to generate Docker templates? This will also modify package.json",
		},
	]);

	packageJson.serve = {
		docker: answers.docker,
	};

	if (answers.docker) {
		packageJson.type = "module";
		packageJson.scripts = {
			...packageJson?.scripts,
			build: "npx @skulpture/serve build",
			watch: "npx @skulpture/serve watch",
			dev: "docker-compose --file docker-compose-dev.yml up",
			start: "docker-compose --file docker-compose.yml up",
		};

		filesToCopy.forEach(file => copyFile(file.from, file.to));
	}

	writeFile(
		`${projectRoot}/package.json`,
		JSON.stringify(packageJson, null, indentation),
	);
};

const pInquirer = (questions: any[]) =>
	new Promise((resolve, reject) =>
		inquirer.prompt(questions).then(resolve).catch(reject),
	);

// From:
// https://github.com/sindresorhus/is-docker/blob/main/index.js
const isRunningInDocker = () => {
	const hasDockerEnv = () =>
		stat("/.dockerenv")
			.then(() => true)
			.catch(() => false);

	const hasDockerCGroup = () =>
		readFile("/proc/self/cgroup", "utf8")
			.then(result => result.includes("docker"))
			.catch(() => false);

	return hasDockerEnv() || hasDockerCGroup();
};

const getIndent = (json: string) =>
	json
		.split(/\n/g)
		.filter(line => !line.includes("{") && !line.includes("}") && !!line)
		.reverse()
		.pop()
		?.match(/\s*/)
		?.pop() ?? "";
