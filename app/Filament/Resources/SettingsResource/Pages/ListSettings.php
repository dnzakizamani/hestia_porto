<?php

namespace App\Filament\Resources\SettingsResource\Pages;

use App\Filament\Resources\SettingsResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSettings extends ListRecords
{
    protected static string $resource = SettingsResource::class;

    protected function getHeaderActions(): array
    {
        $existing = \App\Models\Settings::where('key', 'website_logo')->first();
        
        if ($existing) {
            return [
                Actions\EditAction::make()
                    ->record($existing),
            ];
        } else {
            return [
                Actions\CreateAction::make()
                    ->label('Set Website Logo'),
            ];
        }
    }
}