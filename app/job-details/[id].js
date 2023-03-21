import { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";

import { icons, COLORS, SIZES } from "../../constants";
import {
  ScreenHeaderBtn,
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  Specifics,
} from "../../components";
import useFetch from "../../hook/useFetch";

const JobDetails = () => {
  const params = useSearchParams();
  const router = useRouter();
  const tabs = ["About", "Qualification", "Responsibilities"];

  const { data, isLoading, error, refetch } = useFetch("job-details", {
    job_id: params.id,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRefresh = useCallback(() => {}, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualification":
        return (
          <Specifics
            title="Qualifications"
            points={data[0]?.job_highlights?.Qualifications ?? ["N/A"]}
          />
        );
        break;
      case "About":
        return (
          <JobAbout info={data[0]?.job_description ?? "No data provided"} />
        );
        break;
      case "Responsibilities":
        return (
          <Specifics
            title="Responsibilities"
            points={data[0]?.job_highlights?.Responsibilities ?? ["N/A"]}
          />
        );
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: "",
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          ),
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : data?.length === 0 ? (
            <Text>No Data</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                location={data[0].job_country}
              />

              <JobTabs
                tabs={tabs}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
              />
              {displayTabContent()}
            </View>
          )}
        </ScrollView>
        <JobFooter
          url={
            data[0]?.job_google_link ??
            "https://careers.google.com/jobs/results"
          }
        />
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
