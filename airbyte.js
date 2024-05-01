const apiKey = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0M2Q2MzU4LTE5Y2ItNDNhZi04MjYxLWU4YjgwNzFjNGRhNSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiY2xhazFzdTU5MDAwMDNiNmNqNW1tcWc4dSJdLCJjdXN0b21lcl9pZCI6ImM4NDU3OTA0LTE5ZDYtNGQxMi1hMjZiLWZmN2M2MWE0NjA1YiIsImVtYWlsIjoibmF6aW1sZWVtYW5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwiZXhwIjoyNTM0MDIyMTQ0MDAsImlhdCI6MTcxNDU0MTU4NywiaXNzIjoiaHR0cHM6Ly9hcHAuc3BlYWtlYXN5YXBpLmRldi92MS9hdXRoL29hdXRoL2NsYWsxc3U1OTAwMDAzYjZjajVtbXFnOHUiLCJqdGkiOiJhNDNkNjM1OC0xOWNiLTQzYWYtODI2MS1lOGI4MDcxYzRkYTUiLCJraWQiOiJhNDNkNjM1OC0xOWNiLTQzYWYtODI2MS1lOGI4MDcxYzRkYTUiLCJuYmYiOjE3MTQ1NDE1MjcsInNwZWFrZWFzeV9jdXN0b21lcl9pZCI6ImI4ZTVlZmNmLTkxMzMtNDhmMC1hODc5LTQ5OWQzNjdkYzQ5ZSIsInNwZWFrZWFzeV93b3Jrc3BhY2VfaWQiOiJjbGFrMXN1NTkwMDAwM2I2Y2o1bW1xZzh1Iiwic3ViIjoiYjhlNWVmY2YtOTEzMy00OGYwLWE4NzktNDk5ZDM2N2RjNDllIiwidXNlcl9pZCI6ImI4ZTVlZmNmLTkxMzMtNDhmMC1hODc5LTQ5OWQzNjdkYzQ5ZSJ9.lCf3t8YJUNmgrJJXhjDpsUfTS56XsWX1sHYXFHKch7cXB1ZibLrfUWfpXHg1lPghXtDYFSpkvQ5pWjXp6fVuhv3TL5J7jB99NvwEQc8X9GKrLQXDZY2IPBFw_gu5FB4rMoIvg6PN5iLARGCX6JJDD5vEILr1mJTpSXnQq_cig03GwCnaYu7u7VO_Nwn4jzzchQgqj9JsMafPt4Xt7RVw6uRsvpHM-k8V6zl6cBabp6RWrekgoIkMEtocoAZrYqt_IWLft9BKEM-VW3TvJf149OLIJVfx8WMlIEEY5SaXYlxd_cU_ddvHyAF-Zzsrdfu3cznBjFN_6KYVG7PMZbfk8A';

const sdkW = require('api')('@airbyte-api/v1#4vsz8clinemryl');
const sdkS = require('api')('@airbyte-api/v1#a933liamtcc0');
const skdD = require('api')('@airbyte-api/v1#byhtdl1jlt91i5p4');
const skdC = require('api')('@airbyte-api/v1#a922liamul7v');

sdkW.auth(apiKey);
sdkS.auth(apiKey);
skdD.auth(apiKey);
skdC.auth(apiKey);

sdkW.createWorkspace({ name: 'Workspace for Customer X' })
  .then(({ data: workspaceResponse }) => {
    console.log('Workspace created:', workspaceResponse);
    return sdkS.createSource({
      configuration: {
        sourceType: 'airtable',
        credentials: {
          api_key: 'patD9UDmt5vl9rRFV.9d9d80e79cb74acbbd1cd04a0cf7a5de1255256445a39e0ba5af242eac0500ae'
        }
      },
      name: 'testing',
      workspaceId: workspaceResponse.workspaceId
    });
  })
  .then(({ data: sourceResponse }) => {
    console.log('Source created:', sourceResponse);
    return skdD.createDestination({
        configuration: {
          destinationType: 'postgres',
          port: 5432,
          schema: 'public',
          ssl_mode: {mode: 'disable'},
          tunnel_method: {tunnel_method: 'NO_TUNNEL'},
          host: 'localHost',
          database: 'testing',
          username: 'nazim',
          password: '12345'
        },
        name: 'Postgres',
        workspaceId: sourceResponse.workspaceId
      })
        .then(({ data: destinationResponse }) => {
            console.log('Destination Created',destinationResponse);
            return skdC.createConnection({
                schedule: {scheduleType: 'manual'},
                dataResidency: 'auto',
                namespaceDefinition: 'destination',
                namespaceFormat: '${SOURCE_NAMESPACE}',
                nonBreakingSchemaUpdatesBehavior: 'ignore',
                sourceId: sourceResponse.sourceId,
                destinationId: destinationResponse.destinationId,
                name: 'airtable_To_Postgres'
              })
                .then(({ data: connectionResponse }) => {
                console.log('Connection created:', connectionResponse);
              });
            });
          })
  .catch(err => {
    console.error('Error:', err);
  });
