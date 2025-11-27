<?php

namespace App\Filament\Resources\ArtistContactResource\Pages;

use App\Filament\Resources\ArtistContactResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListArtistContacts extends ListRecords
{
    protected static string $resource = ArtistContactResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}