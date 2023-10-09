    # Create a defined location space time cube using a related table
    # Using a reference time at the start of the month to force binning fall on month breaks
    # Using temporal aggregation to sum multiple entries into one month
    # Using the method drop location if missing values since we already filled using Fill Missing Values
    arcpy.stpm.CreateSpaceTimeCubeDefinedLocations("Chicago_FilledFeature", r"C:\STPM\Chicago_Cube.nc", "MYID",
                                                   "APPLY_TEMPORAL_AGGREGATION", "TIME", "1 Months", "REFERENCE_TIME",
                                                   "10/1/2015", "", "COUNT SUM DROP_LOCATIONS", "Chicago_FilledTable",
                                                   "MYID")