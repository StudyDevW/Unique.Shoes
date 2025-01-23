#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Unique.Shoes.PaymentAPI/Unique.Shoes.PaymentAPI.csproj", "Unique.Shoes.PaymentAPI/"]
RUN dotnet restore "Unique.Shoes.PaymentAPI/Unique.Shoes.PaymentAPI.csproj"
COPY . .
WORKDIR "/src/Unique.Shoes.PaymentAPI"
RUN dotnet build "Unique.Shoes.PaymentAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Unique.Shoes.PaymentAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Unique.Shoes.PaymentAPI.dll"]