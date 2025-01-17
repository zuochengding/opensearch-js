/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

'use strict'

const { bench } = require('../suite')({
  report: {
    url: process.env.OPENSEARCH_RESULT_CLUSTER_URL,
    username: process.env.OPENSEARCH_RESULT_CLUSTER_USERNAME,
    password: process.env.OPENSEARCH_RESULT_CLUSTER_PASSWORD
  }
})
const { Client } = require('../../../index')
const { connection } = require('../../utils')

bench('Initialization', { warmup: 5, measure: 10, iterations: 1000 }, async b => {
  b.start()
  for (let i = 0; i < b.iterations; i++) {
    const client = new Client({ // eslint-disable-line
      node: 'http://localhost:9200'
    })
  }
  b.end()
})

bench('Call api with lazy loading', { warmup: 5, measure: 10 }, async b => {
  const client = new Client({
    node: 'http://localhost:9200',
    Connection: connection.MockConnection
  })

  b.start()
  await client.info()
  b.end()
})

bench('Call api without lazy loading', { warmup: 5, measure: 10 }, async b => {
  const client = new Client({
    node: 'http://localhost:9200',
    Connection: connection.MockConnection
  })

  await client.info()
  b.start()
  await client.info()
  b.end()
})

bench('Basic get', { warmup: 5, measure: 10, iterations: 1000 }, async b => {
  const client = new Client({
    node: 'http://localhost:9200',
    Connection: connection.MockConnection
  })

  // we run the method twice to skip the lazy loading overhead
  await client.search({
    index: 'test',
    type: 'doc',
    q: 'foo:bar'
  })
  b.start()
  for (let i = 0; i < b.iterations; i++) {
    await client.search({
      index: 'test',
      type: 'doc',
      q: 'foo:bar'
    })
  }
  b.end()
})

bench('Basic post', { warmup: 5, measure: 10, iterations: 1000 }, async b => {
  const client = new Client({
    node: 'http://localhost:9200',
    Connection: connection.MockConnection
  })

  // we run the method twice to skip the lazy loading overhead
  await client.search({
    index: 'test',
    type: 'doc',
    body: {
      query: {
        match: { foo: 'bar' }
      }
    }
  })
  b.start()
  for (let i = 0; i < b.iterations; i++) {
    await client.search({
      index: 'test',
      type: 'doc',
      body: {
        query: {
          match: { foo: 'bar' }
        }
      }
    })
  }
  b.end()
})
