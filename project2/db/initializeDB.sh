#!/bin/bash

mongoimport -h localhost:27017 -d wildFires -c Fires --drop --jsonArray ./db/Fires.json