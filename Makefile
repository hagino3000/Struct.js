SRC_DIR = src
FILES = ${SRC_DIR}/api.js ${SRC_DIR}/trap.js ${SRC_DIR}/typechecker.js ${SRC_DIR}/all.js

CONCAT_FILE = struct.js
MINIFY_FILE = struct.min.js

default_target: all

TARGET = clean concat minify

all: $(TARGET)

setup_build_environment:
	@echo "** Pull node_modules for building script"
	npm install

clean:
	@echo "** Start clean generated files"
	@echo "rm ${CONCAT_FILE}"
	-rm -f ${CONCAT_FILE}
	@echo "rm ${MINIFY_FILE}"
	-rm -f ${MINIFY_FILE}

concat: clean ${FILES}
	@echo "** Start concat source files"
	node build/concat.js > ${CONCAT_FILE}

check: concat
	@echo "** Start check source files by jshint"
	node build/check.js < ${CONCAT_FILE}

minify: check
	@echo "** Start minify concat file"
	./node_modules/uglify-js/bin/uglifyjs --unsafe < ${CONCAT_FILE} > ${MINIFY_FILE}
	@echo "Created ${MINIFY_FILE}"

test: struct.js
	@echo "** Start tests"
	node --harmony ./node_modules/jasmine-node/bin/jasmine-node test


