<?php

namespace App\Filament\Resources\SettingsResource\Pages;

use App\Filament\Resources\SettingsResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use App\Models\Settings;

class CreateSettings extends CreateRecord
{
    protected static string $resource = SettingsResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Always update the existing setting instead of creating new ones
        Settings::updateOrCreate(
            ['key' => 'website_logo'],
            ['value' => json_encode(['path' => $data['value']['path'] ?? $data['value']])]
        );

        // Return empty array to prevent normal create
        return [];
    }

    protected function afterCreate(): void
    {
        // Skip the default redirect logic since we're not creating normally
        $this->redirect($this->getRedirectUrl());
    }
}