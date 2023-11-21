export const FeedBackMode = {
    SUCCESS: {messages: ['Opération réalisée avec succès'], severity: 'success', timeOut: 20000},
    ERROR: {messages: ["Echèc de l'opération"], severity: 'error', timeOut: 40000},
    INFO: {messages: [], severity: 'info', timeOut: 35000},
    WARNING: {messages: [], severity: 'warning', timeOut: 35000},
};