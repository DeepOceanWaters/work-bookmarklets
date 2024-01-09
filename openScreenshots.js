document.querySelectorAll('input').forEach(inp => {
    if (inp.value.slice(0,5) === 'https') window.open(inp.value, '_blank');
});