// amplify/data/resources/visitRecordTable.js
const { connectTable } = require('@aws-amplify/data');

exports.VisitRecordTableDataSource = connectTable({
    partitionKey: 'visitRecordId',
    fields: {
        visitRecordId: 'string',
        visitDate: 'string',
        officeId: 'string',
        childId: 'string',
        plannedArrivalTime: 'string',
        contractedDuration: 'number',
        actualArrivalTime: 'string',
        actualLeaveTime: 'string',
        actualDuration: 'number',
        lateReasonCode: 'string',
        earlyLeaveReasonCode: 'string',
        isManuallyEntered: 'boolean',
        isDeleted: 'boolean',
        createdAt: 'string',
        createdBy: 'string',
        updatedAt: 'string',
        updatedBy: 'string',
        version: 'number',
    },
});
