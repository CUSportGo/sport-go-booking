proto:
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto -I=./src/proto --ts_proto_out=./src/booking src/proto/booking.proto --ts_proto_opt=nestJs=true --ts_proto_opt=fileSuffix=.pb
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto -I=./src/proto --ts_proto_out=./src/sportarea src/proto/sportarea.proto --ts_proto_opt=nestJs=true --ts_proto_opt=fileSuffix=.pb
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto -I=./src/proto --ts_proto_out=./src/user src/proto/user.proto --ts_proto_opt=nestJs=true --ts_proto_opt=fileSuffix=.pb

