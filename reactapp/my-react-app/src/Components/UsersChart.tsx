import {
    Card,
    CardBody,
    CardHeader,
  } from "@material-tailwind/react";
  import Chart from "react-apexcharts";
  import { useEffect, useState } from "react";
  import axios from "axios";
  
  export default function Example() {
    const [categories, setCategories] = useState<string[]>([]);
    const [counts, setCounts] = useState<number[]>([]);
  
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/Account/UsersPerMonth",
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
  
        const data = response.data;
      
        const categoryNames = Object.keys(data); // Extract keys as category names
      
        const categoryCounts = Object.values(data); // Extract values as category counts
       

        setCategories(categoryNames);
        setCounts(categoryCounts);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const serverResponse = error.response?.data;
          if (serverResponse?.errors) {
            alert(serverResponse.errors.join("\n"));
          } else if (serverResponse?.message) {
            alert(serverResponse.message);
          } else {
            alert(error.response?.statusText || "Fetch failed");
          }
        } else {
          alert("An unexpected error occurred");
        }
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const getChartConfig = (categories: string[], data: number[]) => ({
      type: "bar",
      height: 240,
      series: [
        {
          name: "Users Created",
          data: data,
        },
      ],
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#020617"],
        plotOptions: {
          bar: {
            columnWidth: "40%",
            borderRadius: 2,
          },
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              colors: "#616161",
              fontSize: "12px",
              fontFamily: "inherit",
              fontWeight: 400,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#616161",
              fontSize: "12px",
              fontFamily: "inherit",
              fontWeight: 400,
            },
          },
        },
        grid: {
          show: true,
          borderColor: "#dddddd",
          strokeDashArray: 5,
          xaxis: {
            lines: {
              show: true,
            },
          },
          padding: {
            top: 5,
            right: 20,
          },
        },
        fill: {
          opacity: 0.8,
        },
        tooltip: {
          theme: "dark",
        },
      },
    });
  
    return (
      <Card  style={{ width: '900px' }}>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
          title="Accounts Created"
        >
          {/* You can add header content here */}
          <div className="bookcategory" style={{backgroundColor:'papayawhip'}}>
          <p >Accounts Created</p>
          </div>
         
        </CardHeader>
        <CardBody className="px-2 pb-0" style={{ width: '100%' }}>
    {categories.length > 0 && counts.length > 0 ? (
        <Chart
            {...getChartConfig(categories, counts)} 
        />
    ) : (
        <p>Loading chart data...</p> 
    )}
</CardBody>
      </Card>
    );
  }
  
  