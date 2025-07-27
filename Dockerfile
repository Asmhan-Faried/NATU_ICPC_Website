FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY . .

# 👈 ده المسار الصحيح لملف المشروع جوا فولدر tired
RUN dotnet restore tired/tired.csproj

RUN dotnet publish tired/tired.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "tired.dll"]
