import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react';

const QuestionnaireScreen = () => {
  const [basicInfoData, setBasicInfoData] = useState({});
  const [positionData, setPositionData] = useState({});
  const [pitcherData, setPitcherData] = useState({});
  const [accessibilityData, setAccessibilityData] = useState({});
  const [strengthData, setStrengthData] = useState({});
  const [healthData, setHealthData] = useState({});
  const [goalsData, setGoalsData] = useState({});

  useEffect(() => {
    // Fetch existing data from AsyncStorage
    const fetchData = async () => {
      const basicInfo = await AsyncStorage.getItem('basicInfo');
      const positionInfo = await AsyncStorage.getItem('positionInfo');
      const pitcherInfo = await AsyncStorage.getItem('pitcherInfo');
      const accessibilityInfo = await AsyncStorage.getItem('accessibilityInfo');
      const strengthInfo = await AsyncStorage.getItem('strengthInfo');
      const healthInfo = await AsyncStorage.getItem('healthInfo');
      const goalsInfo = await AsyncStorage.getItem('goalsInfo');

      if (basicInfo) setBasicInfoData(JSON.parse(basicInfo));
      if (positionInfo) setPositionData(JSON.parse(positionInfo));
      if (pitcherInfo) setPitcherData(JSON.parse(pitcherInfo));
      if (accessibilityInfo) setAccessibilityData(JSON.parse(accessibilityInfo));
      if (strengthInfo) setStrengthData(JSON.parse(strengthInfo));
      if (healthInfo) setHealthData(JSON.parse(healthInfo));
      if (goalsInfo) setGoalsData(JSON.parse(goalsInfo));
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    // Save data to AsyncStorage
    await AsyncStorage.setItem('basicInfo', JSON.stringify(basicInfoData));
    await AsyncStorage.setItem('positionInfo', JSON.stringify(positionData));
    await AsyncStorage.setItem('pitcherInfo', JSON.stringify(pitcherData));
    await AsyncStorage.setItem('accessibilityInfo', JSON.stringify(accessibilityData));
    await AsyncStorage.setItem('strengthInfo', JSON.stringify(strengthData));
    await AsyncStorage.setItem('healthInfo', JSON.stringify(healthData));
    await AsyncStorage.setItem('goalsInfo', JSON.stringify(goalsData));
  };

  return (
    <div>
      {/* Render your form components here */}
    </div>
  );
};

export default QuestionnaireScreen; 