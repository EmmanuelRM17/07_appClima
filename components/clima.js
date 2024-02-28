import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Definir las partes constituyentes de la URL de la API y la clave de API como variables
const baseURL = 'http://api.weatherapi.com/v1/forecast.json';
const apiKey = 'b4b5d1d043c844b1941170256231610';
const location = 'Huejutla de Reyes';
const days = 5;
const aqi = 'no';
const alerts = 'no';

const weatherURL = `${baseURL}?key=${apiKey}&q=${encodeURIComponent(location)}&days=${days}&aqi=${aqi}&alerts=${alerts}`;

// Función para obtener los datos meteorológicos
const fetchWeatherData = async () => {
    try {
        const response = await fetch(weatherURL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
};


const HourlyForecastCard = ({ time, temp, iconUrl }) => (
    <View style={styles.hourlyCard}>
        <Text style={styles.hourlyTime}>{time}</Text>
        <Image style={styles.hourlyImage} source={{ uri: iconUrl }} />
        <Text style={styles.hourlyTemp}>{temp}°C</Text>
    </View>
);

const CurrentWeather = ({ weatherData }) => {
    const currentHour = new Date().getHours(); // Obtiene la hora actual en formato 24 horas

    const filteredHours = weatherData.forecast.forecastday[0].hour.filter(item => {
        return new Date(item.time).getHours() >= currentHour;
    });

    return (
        <View style={[styles.weatherContainer, styles.currentWeatherContainer]}>
            <View style={styles.weatherScreen}>
                <Text style={styles.locationName}>{weatherData.location.name}</Text>
                <Image
                    style={styles.currentConditionImage}
                    source={{ uri: `https:${weatherData.current.condition.icon}` }}
                />
                <Text style={styles.currentTemp}>{weatherData.current.temp_c}°C</Text>
                <Text style={styles.conditionText}>
                    {weatherData.current.condition.text} - {weatherData.forecast.forecastday[0].day.maxtemp_c}°C / {weatherData.forecast.forecastday[0].day.mintemp_c}°C
                </Text>
                <Text style={styles.hourlyHeader}>Pronóstico del día</Text>
                <FlatList
                    data={filteredHours}
                    renderItem={({ item }) => (
                        <HourlyForecastCard
                            time={`${new Date(item.time).getHours()}:00`}
                            temp={item.temp_c}
                            iconUrl={`https:${item.condition.icon}`}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.hourlyList}
                />
            </View>
        </View>
    );
};

const WeeklyWeather = ({ forecast }) => {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const renderItem = ({ item }) => {
        const date = new Date(item.date);
        const dayOfWeek = daysOfWeek[date.getDay()];
        return (
            <View style={styles.weeklyWeatherItem}>
                <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
                <View style={styles.weatherDetails}>
                    <Text style={styles.temperature}>{item.day.maxtemp_c}°C / {item.day.mintemp_c}°C</Text>
                    <Image style={styles.weatherIcon} source={{ uri: `https:${item.day.condition.icon}` }} />
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.weatherContainer, styles.weeklyWeatherContainer]}>
            <FlatList
                data={forecast.forecastday}
                renderItem={renderItem}
                keyExtractor={(item) => item.date} // Usamos la fecha como clave única
                contentContainerStyle={styles.weeklyWeatherList}
            />
        </View>
    );
};

const Clima = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchWeatherData();
            setWeatherData(data);
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Cargando datos...</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
            <View style={styles.container}>
                <FlatList
                    data={[{ key: 'currentWeather' }, { key: 'weeklyWeather' }]}
                    renderItem={({ item }) => {
                        if (item.key === 'currentWeather') {
                            return <CurrentWeather weatherData={weatherData} />;
                        } else if (item.key === 'weeklyWeather') {
                            return <WeeklyWeather forecast={weatherData.forecast} />;
                        }
                    }}
                    keyExtractor={(item) => item.key}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: '#E6E6E6', // Color de fondo suave
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E6E6E6', // Igual que el color de fondo del contenedor
    },
    loadingText: {
      fontSize: 18,
      color: '#5D5D5D', // Color de texto para el contraste con el fondo
    },
    weatherContainer: {
      marginBottom: 20,
      borderRadius: 20,
      backgroundColor: '#FFFFFF', // Fondo blanco para las tarjetas
      padding: 15,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10, // Sombra para dar profundidad
    },
    weatherScreen: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    locationName: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#333333', // Texto oscuro para mayor contraste
      marginBottom: 10,
    },
    currentConditionImage: {
      width: 80,
      height: 80,
      marginVertical: 10,
    },
    currentTemp: {
      fontSize: 64,
      fontWeight: 'bold',
      color: '#333333',
      marginVertical: 5,
    },
    conditionText: {
      fontSize: 20,
      color: '#333333',
      marginBottom: 20,
    },
    hourlyHeader: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: 10,
    },
    hourlyList: {
      marginBottom: 20,
    },
    hourlyCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      padding: 10,
      margin: 10,
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    hourlyTime: {
      fontSize: 16,
      color: '#333333',
      marginBottom: 5,
    },
    hourlyImage: {
      width: 40,
      height: 40,
      marginBottom: 5,
    },
    hourlyTemp: {
      fontSize: 18,
      color: '#333333',
    },
    weeklyWeatherList: {
      paddingHorizontal: 10,
    },
    weeklyWeatherItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      padding: 10,
      marginBottom: 10,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    dayOfWeek: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
    },
    temperature: {
      fontSize: 18,
      color: '#333333',
    },
    weatherIcon: {
      width: 40,
      height: 40,
    },
  });
  
  export default Clima; 