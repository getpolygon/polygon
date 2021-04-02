FROM minio/minio:latest
WORKDIR /minio
COPY . .
RUN chmod +x ./start.sh
ENTRYPOINT [ "./start.sh" ]
