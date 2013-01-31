<script type="text/javascript">
  (function() {
	var img = document.createElement('img');
	var date = new Date;
	var params = [];
    var url = 'http://localhost:3000/api/activity?';
	params.push('time='+date.getTime());
	params.push('url='+encodeURIComponent(document.location));
	params.push('ref='+encodeURIComponent(document.referrer));
	url += params.join('&');
	img.src = url;
  })();
</script>