#!/usr/bin/env node

/**
 * SIA public benchmark scorer.
 *
 * Public-safe utility only. It contains no proprietary runtime logic,
 * prompts, policies, private corpus data, or production orchestration code.
 */

import fs from "node:fs";

function fail(message) {
  console.error(`Benchmark error: ${message}`);
  process.exit(1);
}

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (error) {
    fail(`cannot read ${path}: ${error.message}`);
  }
}

function validateResult(result, path) {
  if (result?.benchmarkVersion !== "0.1") {
    fail(`${path}: benchmarkVersion must be 0.1`);
  }
  if (!result?.label || !Array.isArray(result?.cases)) {
    fail(`${path}: label and cases are required`);
  }
  const env = result.environment ?? {};
  for (const field of ["model", "hardware", "taskSet"]) {
    if (!env[field]) fail(`${path}: environment.${field} is required`);
  }

  const seen = new Set();
  for (const item of result.cases) {
    if (!item?.id) fail(`${path}: every case needs an id`);
    if (seen.has(item.id)) fail(`${path}: duplicate case id ${item.id}`);
    seen.add(item.id);

    for (const field of [
      "taskSuccess",
      "toolCalls",
      "successfulToolCalls",
      "invalidArguments",
      "repairs",
      "verificationFailures",
      "falseCompletion",
      "elapsedMs",
    ]) {
      if (!(field in item)) fail(`${path}: ${item.id} is missing ${field}`);
    }

    if (item.successfulToolCalls > item.toolCalls) {
      fail(`${path}: ${item.id} has successfulToolCalls > toolCalls`);
    }
  }
}

function summarize(result) {
  const totals = result.cases.reduce(
    (acc, item) => {
      acc.taskSuccess += item.taskSuccess ? 1 : 0;
      acc.toolCalls += item.toolCalls;
      acc.successfulToolCalls += item.successfulToolCalls;
      acc.invalidArguments += item.invalidArguments;
      acc.repairs += item.repairs;
      acc.verificationFailures += item.verificationFailures;
      acc.falseCompletion += item.falseCompletion ? 1 : 0;
      acc.elapsedMs += item.elapsedMs;
      return acc;
    },
    {
      taskSuccess: 0,
      toolCalls: 0,
      successfulToolCalls: 0,
      invalidArguments: 0,
      repairs: 0,
      verificationFailures: 0,
      falseCompletion: 0,
      elapsedMs: 0,
    },
  );

  return {
    label: result.label,
    cases: result.cases.length,
    taskSuccessRate: result.cases.length
      ? totals.taskSuccess / result.cases.length
      : 0,
    toolCallSuccessRate: totals.toolCalls
      ? totals.successfulToolCalls / totals.toolCalls
      : null,
    invalidArguments: totals.invalidArguments,
    repairs: totals.repairs,
    verificationFailures: totals.verificationFailures,
    falseCompletionCount: totals.falseCompletion,
    elapsedMs: totals.elapsedMs,
  };
}

function ensureComparable(a, b, aPath, bPath) {
  const fields = ["model", "hardware", "taskSet"];
  for (const field of fields) {
    if (a.environment[field] !== b.environment[field]) {
      fail(
        `results are not directly comparable: environment.${field} differs between ${aPath} and ${bPath}`,
      );
    }
  }

  const aIds = [...a.cases.map((x) => x.id)].sort();
  const bIds = [...b.cases.map((x) => x.id)].sort();
  if (JSON.stringify(aIds) !== JSON.stringify(bIds)) {
    fail("results are not directly comparable: case IDs differ");
  }
}

const paths = process.argv.slice(2);
if (paths.length < 1 || paths.length > 2) {
  fail("usage: node benchmarks/v0/score.mjs <result.json> [comparison.json]");
}

const first = readJson(paths[0]);
validateResult(first, paths[0]);

if (paths.length === 1) {
  console.log(JSON.stringify(summarize(first), null, 2));
  process.exit(0);
}

const second = readJson(paths[1]);
validateResult(second, paths[1]);
ensureComparable(first, second, paths[0], paths[1]);

console.log(
  JSON.stringify(
    {
      benchmarkVersion: "0.1",
      comparison: [summarize(first), summarize(second)],
      note: "These metrics are descriptive. Interpret them only for runs using the same model, hardware, task set, and controlled conditions.",
    },
    null,
    2,
  ),
);
