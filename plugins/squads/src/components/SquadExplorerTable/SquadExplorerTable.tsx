/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Entity } from '@backstage/catalog-model';
import { Table, TableColumn } from '@backstage/core';
import { Chip, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { rootRouteRef, relativeEntityRouteRef } from '../../plugin';


const columns: TableColumn<Entity>[] = [
  {
    title: 'Name',
    field: 'metadata.name',
    highlight: true,
    render: (entity: any) => (
      <Link
        component={RouterLink}
        to={generatePath(rootRouteRef.path + relativeEntityRouteRef.path, {
          optionalNamespaceAndName: [
            entity.metadata.namespace,
            entity.metadata.name,
          ]
            .filter(Boolean)
            .join(':'),
          kind: entity.kind,
          selectedTabId: 'overview',
        })}
      >
        {entity.metadata.name}
      </Link>
    ),
  },
  {
    title: 'Description',
    field: 'metadata.description',
  },
  {
    title: 'Tags',
    field: 'metadata.tags',
    cellStyle: {
      padding: '0px 16px 0px 20px',
    },
    render: (entity: Entity) => (
      <>
        {entity.metadata.tags &&
          entity.metadata.tags.map(t => (
            <Chip key={t} label={t} style={{ marginBottom: '0px' }} />
          ))}
      </>
    ),
  },
];

type ExplorerTableProps = {
  entities: Entity[];
  titlePreamble: string;
  loading: boolean;
  error?: any;
};

export const SquadExplorerTable = ({
  entities,
  loading,
  error,
  titlePreamble,
}: ExplorerTableProps) => {
  if (error) {
    return (
      <div>
        <Alert severity="error">
          Error encountered while fetching catalog entities. {error.toString()}
        </Alert>
      </div>
    );
  }

  return (
    <Table<Entity>
      isLoading={loading}
      columns={columns}
      options={{
        paging: false,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        showEmptyDataSourceMessage: !loading,
      }}
      title={`${titlePreamble} (${(entities && entities.length) || 0})`}
      data={entities}
    />
  );
};
