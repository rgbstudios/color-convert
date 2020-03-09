let hexSettings = {
	usePound: true,
	useCaps: true
};

$(function() {
	$('#use-pound-checkbox').change(function() {
		hexSettings.usePound = $('#use-pound-checkbox').is(':checked');
		refreshColor();
	});
	$('#use-caps-checkbox').change(function() {
		hexSettings.useCaps = $('#use-caps-checkbox').is(':checked');
		refreshColor();
	});
});