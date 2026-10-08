.PHONY: check serve
check:
	node --check docs/app.js
serve:
	python3 -m http.server 8768 --bind 127.0.0.1 --directory docs
