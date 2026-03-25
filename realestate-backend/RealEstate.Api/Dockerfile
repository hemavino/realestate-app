# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copy csproj and restore dependencies
COPY RealEstate.Api/RealEstate.Api.csproj RealEstate.Api/
COPY global.json .
RUN dotnet restore "RealEstate.Api/RealEstate.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/RealEstate.Api"
RUN dotnet build "RealEstate.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "RealEstate.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=publish /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "RealEstate.Api.dll"]
