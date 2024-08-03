FROM node:22
RUN npx playwright install --with-deps chromium
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DOCURUN_SOURCE_FOLDER=/docurun
CMD ["./bin/docurun.js"]